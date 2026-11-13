# k8s operations

## Interactive shell

```sh
kubectl exec -it <pod-name> -- bash
```

## Scale

```sh
kubectl scale deployment nginx-test --replicas=3
```

## Export
```sh
kubectl get pod <pod-name> -o yaml > pod-config.yaml
```

## Stop pod

```sh
kubectl delete pod <pod-name>
```


## Create a debug pod
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: toolbelt
  labels:
    purpose: debug
spec:
  containers:
    - name: debian-tooling
      image: debian:latest
      command: ["/bin/bash", "-c", "--"]
      args: ["while true; do sleep 30; done;"]
      volumeMounts:
        - name: app-data
          mountPath: /mnt/data
  volumes:
    - name: app-data
      persistentVolumeClaim:
        claimName: app-data
```