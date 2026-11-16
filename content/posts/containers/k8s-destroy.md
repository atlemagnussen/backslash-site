---
lang: en-US
title: K8s Destroy
description: Destroy a K8s cluster
date: 2026-03-08
category:
  - kubernetes
tag:
  - linux
  - k8s
  - containers
---


# Destroy a cluster

How to take a kubeadm cluster down cleanly: drain and delete the workers, then reset the control plane.

## Drain workers
```sh
kubectl drain k3w1 --ignore-daemonsets
```

## Delete workers
```sh
kubectl delete node k8s-03-worker-02
```

## Reset control plane
```sh
sudo kubeadm reset -f
```

## uninstall

```sh
sudo apt purge -y kubeadm kubectl kubelet kubernetes-cni
sudo apt autoremove -y
```

## Clean data

```sh
sudo rm -rf /etc/cni /etc/kubernetes /var/lib/kubelet /var/lib/etcd /var/run/kubernetes ~/.kube

```