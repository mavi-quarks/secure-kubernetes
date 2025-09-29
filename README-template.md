# <Project/Phase Title>

## Table of Contents
- [Setup](#setup)
- [Cluster and Nodes](#cluster-and-nodes)
- [Inside the Pod](#inside-the-pod)
- [Deployments](#deployments)
- [Services](#services)
- [Custom Images](#custom-images)
- [NodePort & LoadBalancer](#nodeport--loadbalancer)
- [Rolling Updates](#rolling-updates)
- [Multiple Deployments](#multiple-deployments)
- [File Structure](#file-structure)
- [Applying YAML Files](#applying-yaml-files)
- [Troubleshooting](#troubleshooting)
- [References](#references)

---

## 🧩 Setup

**Operating system:**  
**Architecture:**  
**Chip:**  

- **Minikube:** Tool to create and run a local Kubernetes cluster.
- **Kubectl:** Command-line tool to interact with a Kubernetes cluster.

**Pre-requisite:**  
Install `kubectl` and `minikube` on your local machine.  
[See official docs](https://kubernetes.io/docs/tasks/tools/)

---

## 🧩 Cluster and Nodes

- Alias for kubectl:
  ```sh
  alias k="kubectl"
  ```
- Display all pods:
  ```sh
  k get pods
  ```
- Display pods in a namespace:
  ```sh
  k get pods --namespace=<namespace>
  ```
- Start cluster:
  ```sh
  minikube start --driver=<driver>
  ```
- Cluster status:
  ```sh
  minikube status
  ```
- Cluster IP:
  ```sh
  minikube ip
  ```
- SSH into node:
  ```sh
  minikube ssh
  ```

---

## 🧩 Inside the Pod

- List containers:
  ```sh
  docker ps
  ```
- Find specific pod:
  ```sh
  docker ps | grep <name>
  ```
- Exec into pod:
  ```sh
  docker exec -it <container-id> sh
  ```
- Exit:
  ```sh
  exit
  ```

---

## 🧩 Deployments

- Create deployment:
  ```sh
  k create deployment <name> --image=<image>
  ```
- Get deployments:
  ```sh
  k get deployments
  ```
- Get pods:
  ```sh
  k get pods
  ```
- Describe deployment:
  ```sh
  k describe deployment <name>
  ```
- Scale deployment:
  ```sh
  k scale deployment <name> --replicas=<count>
  ```
- Get pods (wide):
  ```sh
  k get pods -o wide
  ```

---

## 🧩 Services

- Expose deployment:
  ```sh
  k expose deployment <name> --port=<port> --target-port=<target-port>
  ```
- Get services:
  ```sh
  k get svc
  ```
- Delete deployment/service:
  ```sh
  k delete deployment <name>
  k delete service <name>
  ```

---

## 🐳 Custom Images

- Initialize Node.js project:
  ```sh
  npm init -y
  ```
- Install dependencies:
  ```sh
  npm install <package>
  ```
- Example Dockerfile:
  ```Dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  EXPOSE 3000
  CMD ["node", "app.js"]
  ```
- .dockerignore:
  ```
  node_modules
  npm-debug.log
  ```
- Build and push image:
  ```sh
  docker build -t <username>/<image>:<tag> .
  docker push <username>/<image>:<tag>
  ```

---

## 🧩 NodePort & LoadBalancer

- Expose as NodePort:
  ```sh
  k expose deployment <name> --type=NodePort --port=<port>
  ```
- Expose as LoadBalancer:
  ```sh
  k expose deployment <name> --type=LoadBalancer --port=<port>
  ```
- Access service:
  ```sh
  minikube service <name>
  ```

---

## 🧩 Rolling Updates

- Build new image and push:
  ```sh
  docker build -t <username>/<image>:<new-tag> .
  docker push <username>/<image>:<new-tag>
  ```
- Update deployment image:
  ```sh
  k set image deployment <name> <container>=<username>/<image>:<new-tag>
  ```
- Monitor rollout:
  ```sh
  k rollout status deployment <name>
  ```
- Rollback:
  ```sh
  k set image deployment <name> <container>=<username>/<image>:<old-tag>
  ```

---

## 🧩 Multiple Deployments

- Delete resources:
  ```sh
  k delete -f <file1>.yaml -f <file2>.yaml
  ```
- Apply multiple specs:
  ```sh
  k apply -f <file1>.yaml -f <file2>.yaml
  ```

---

## File Structure

```text
<phase-folder>/
  <app1>/
    app.js
    Dockerfile
    package.json
  <app2>/
    ...
  deployment.yaml
  service.yaml
  ...
.gitignore
README.md
```

---

## Applying YAML Files

```sh
kubectl apply -f <phase-folder>/deployment.yaml
kubectl apply -f <phase-folder>/service.yaml
kubectl apply -f <phase-folder>/
```

---

## Troubleshooting

- Minikube fails to start:  
  `minikube delete` then `minikube start --driver=<driver>`
- Pods not running:  
  `kubectl logs <pod-name>`
- Service not accessible:  
  `minikube service <service-name>`
- YAML errors:  
  `kubectl apply --dry-run=client -f <file>`

---

## References

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

---
