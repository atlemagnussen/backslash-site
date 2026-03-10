---
lang: en-US
title: K8s Cluster
description: Set up a K8s cluster on VMs
date: 2026-03-08
category:
  - kubernetes
tag:
  - linux
  - k8s
  - containers
---


# K8s cluster

Create a cluster on VMs using virt. See article on that. 

## Spawning VMs

This article assumes you have a relative clean Debian VM that will serve eventually as one of 3 nodes. So we start here by cloning 2 times into 3 total VMs.

Create the clones

```sh
virt-clone --original k8s-master-01 --name k8s-worker-01 --file /mnt/ssd1/vms/kvm/k8s-worker-01.qcow2
```

Start it up and make them appear unique (MACaddress is already handled)

1. Change the Hostname
```sh
sudo hostnamectl set-hostname k8s-worker-01
sudo sed -i "s/k8s-master-01/k8s-worker-01/g" /etc/hosts
```

reboot

2. Reset the Machine ID (Crucial for K8s)
```sh
sudo rm -f /etc/machine-id /var/lib/dbus/machine-id
sudo systemd-machine-id-setup
sudo dbus-uuidgen --ensure
```

3. Disable swap on all nodes

```sh
sudo swapoff -a
sudo sed -i '/swap/s/^/#/' /etc/fstab
```

4. Enable nftables (nftables is default from k8s 1.33)

Example of `/etc/nftables.conf`

```sh
#!/usr/sbin/nft -f
flush ruleset
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        ct state established,related accept
        iif lo accept
        ip protocol icmp accept
        tcp dport 22 accept  # SSH
        # K8s Control Plane (Run this on Master)
        tcp dport 6443 accept
        tcp dport { 2379, 2380 } accept
        # K8s Node Communication (Run on all nodes)
        tcp dport 10250 accept
        # CNI Overlay (Allow nodes to "tunnel" to each other)
        # If using Calico
        tcp dport 179 accept 
        udp dport 4789 accept
        tcp dport 443 accept
        ip protocol 4 accept

        # nodeports
        tcp dport 30000-32767 accept
    }
    chain forward {
        type filter hook forward priority 0; policy accept;
    }
}
```

```sh
sudo systemctl enable --now nftables
sudo systemctl start nftables
```

5. Make sure your nodes has STATIC IPs. 

or else you need to tear the whole thing down later probably

Reboot

## Installing k8s

sudo apt install -y apt-transport-https ca-certificates curl gpg

### containerd.io

See [docker homepage](https://docs.docker.com/engine/install/debian/) for up to date instructions

```sh
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/debian
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install containerd.io
```

#### config containerD

```sh
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null

sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml

sudo systemctl restart containerd
```

#### K8s

```sh

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.35/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.35/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt update
sudo apt install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

```

#### modeprobe overlay

```sh
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
```

#### enable network forwarding

```sh
sudo tee /etc/sysctl.d/kubernetes.conf <<EOT
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOT

sudo sysctl --system
```

verify

```sh
sudo sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

all should be 1

## Initialze (only master node)

```sh
sudo kubeadm init --apiserver-advertise-address=192.168.1.190 --pod-network-cidr=10.244.0.0/16
```

### To reset 

```sh
sudo kubeadm reset -f
sudo rm -rf /etc/cni/net.d
```

Expected answer

```bash
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.1.190:6443 --token x \
        --discovery-token-ca-cert-hash sha256:x
```

save the command from this output and use it to join worker nodes later


## Verify

```sh
kubectl get nodes
```

Expected response before set up network and other nodes:

```bash
NAME            STATUS     ROLES           AGE     VERSION
k8s-master-01   NotReady   control-plane   3m33s   v1.35.2
```

## Calico (only master node)

```sh
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.30.0/manifests/calico.yaml

kubectl set env daemonset/calico-node  -n kube-system IP_AUTODETECTION_METHOD=interface=enp1s0
```

## Test app

```sh
kubectl create deployment nginx-test --image=nginx --replicas=2

kubectl expose deployment nginx-test --port=80 --target-port=80 --type=NodePort
kubectl get svc nginx-test # get port and test in browser

```

## MetalB

kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.15.3/config/manifests/metallb-native.yaml

make `metallb-config.yaml`

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: first-pool
  namespace: metallb-system
spec:
  addresses:
  - 192.168.1.50-192.168.1.60
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: homelab-adv
  namespace: metallb-system
```

kubectl apply -f metallb-config.yaml

Check if pods instances have different Ips (not from 192.168.1.x)
kubectl get pods -o wide

## NGINX Ingress

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

check if running 
kubectl get pods -n ingress-nginx

Expected result
kubectl get pods -n ingress-nginx
NAME                                        READY   STATUS    RESTARTS   AGE
ingress-nginx-controller-7fdf8d9764-jhtjt   0/1     Running   0          14s

kubectl get svc -n ingress-nginx

check if 192.168.1.50

create `nginx-ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: nginx.yourdomain.com  # REPLACE WITH YOUR ACTUAL DOMAIN
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-test     # Your existing service name
            port:
              number: 80
```

kubectl apply -f nginx-ingress.yaml

## snapshot master node

virsh snapshot-create-as --domain k8s-master-01 \
    --name post_ingress_stable \
    --description "Master node with working Ingress and MetalLB" \
    --atomic

## TLS

cert-manager

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.19.4/cert-manager.yaml

kubectl create secret generic cloudflare-api-token-secret \
  --from-literal=api-token=x \
  -n cert-manager


`cloudflare-issuer.yaml``

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-cloudflare
spec:
  acme:
    email: your-email@example.com # Use your real email for expiry alerts
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-cloudflare-account-key
    solvers:
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
```

kubectl apply -f cloudflare-issuer.yaml

change `nginx-ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-test-ingress
  annotations:
    # This links the Ingress to your Cloudflare Issuer
    cert-manager.io/cluster-issuer: "letsencrypt-cloudflare"
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - nginx.your.domain
    # Cert-manager will create this Secret to store your keys
    secretName: nginx-logout-tls 
  rules:
  - host: nginx.your.domain
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-lb
            port:
              number: 80
```

kubectl apply -f nginx-ingress.yaml

kubectl get certificate
(It will start as READY: False while it talks to Cloudflare.)

dig @1.1.1.1 TXT _acme-challenge.nginx.your.domain


## Scale

kubectl scale deployment nginx-test --replicas=3

## persistense

on host

```sh
qemu-img create -f qcow2 /mnt/ssd1/vms/kvm/k8s-worker-01-data.qcow2 20G

virsh attach-disk k8s-worker-01 \
--source /mnt/ssd1/vms/kvm/k8s-worker-01-data.qcow2 \
--target vdb \
--driver qemu \
--subdriver qcow2 \
--persistent
```

on VM

```sh
sudo fdisk /dev/vdb
sudo mkfs.ext4 /dev/vdb1
```

fstab
/dev/vdb1       /data       ext4    defaults        0       2


on master
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: kubernetes.io/no-provisioner
volumeBindingMode: WaitForFirstConsumer
```

on worker

```sh
sudo mkdir -p /data/k8s/local-pv
sudo chmod 0777 /data/k8s/local-pv
```

on master

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-pv-worker2
spec:
  capacity:
    storage: 20Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  storageClassName: local-storage
  persistentVolumeReclaimPolicy: Retain
  local:
    path: /data/k8s/local-pv
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: kubernetes.io/hostname
              operator: In
              values:
                - k8s-worker-02
```

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-storage
  resources:
    requests:
      storage: 10Gi
```



virsh detach-disk --domain k8s-worker-01 --target vdb --live
virsh detach-disk k8s-worker-01 vdb --config


## Disconnect node

kubectl cordon k8s-worker-03
kubectl drain k8s-worker-03 --ignore-daemonsets --delete-emptydir-data
kubectl delete node k8s-worker-03
