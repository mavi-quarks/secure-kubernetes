
# Kubernetes Core

## Table of Contents
- [Kubernetes Core](#kubernetes-core)
  - [Table of Contents](#table-of-contents)
      - [🧩 My Setup](#-my-setup)
      - [🧩 Cluster and Nodes](#-cluster-and-nodes)
      - [🧩  INSIDE the POD](#--inside-the-pod)
    - [🧩 Creating \& Exploring Deployment](#-creating--exploring-deployment)
    - [🧩 Kubernetes Services](#-kubernetes-services)
    - [🧩 Deployment \& Service Delete](#-deployment--service-delete)
    - [🧩 Deploying using your Custom Image](#-deploying-using-your-custom-image)
    - [🧩 NodePort Service](#-nodeport-service)
    - [🧩 Rolling Updates and Pods Recovery](#-rolling-updates-and-pods-recovery)
    - [YAML Specification Files](#yaml-specification-files)
    - [🧩 Multiple Deployments Creation](#-multiple-deployments-creation)
  - [File Structure](#file-structure)
  - [🚀 Applying Kubernetes Manifests](#-applying-kubernetes-manifests)
  - [Troubleshooting](#troubleshooting)
  - [References](#references)

#### 🧩 My Setup

**Operating system:** macOS  
**Architecture:** ARM 64  
**Chip:** Apple M1


▶️  **Minikube:** Tool to create and run a local Kubernetes cluster on your machine. Features include: stop, start, delete, pause, unpause, dashboard, and more.

▶️ **Kubectl:** Command-line tool to interact with a Kubernetes cluster. Connects to the Master Node API server via HTTPS.



**Pre-requisite:** Install `kubectl` and `minikube` on your local machine. [See official docs](https://kubernetes.io/docs/tasks/tools/)

---
---

#### 🧩 Cluster and Nodes
Below are common commands I used to manage and perform  tasks in cluster.


**Alias to rename kubectl into “k”:**
```sh
alias k="kubectl"
```


**Display all pods from default namespace:**
```sh
k get pods
```


**Display pods from specific namespace (e.g., kube-system):**
```sh
k get pods --namespace=kube-system
```



**Start and create 1-node cluster (ARM 64 → docker):**
```sh
minikube start --driver=docker
```


**See the status of your local Kubernetes cluster:**
```sh
minikube status
```


**Get the IP address of your k8s cluster:**
```sh
minikube ip
```


**Go inside the node named “minikube” to explore:**
```sh
minikube ssh
```

---
---

#### 🧩  INSIDE the POD

**Display all containers:**
```sh
docker ps
```


**Display specific pod “nginx”:**
```sh
docker ps | grep nginx
```


**Execute shell in a pod (replace `<container-id>`):**
```sh
docker exec -it <container-id> sh
```


**Exit the POD:**
```sh
exit
```
---
---

### 🧩 Creating & Exploring Deployment
 It is not convenient to create separate Pods inside of the Kubernetes cluster because you are not able to scale and increase quantity of the Pods. The most common way to manage pods is through `deployment`.

`Deployment` is responsible for creation of the actual Pods. And all Pods inside of the deployment will be the same. But you could create multiple copies of the same Pods and distribute load across different nodes in the Kubernetes cluster. That's purpose of the deployment.


**Create deployment:**
```sh
k create deployment nginx-deployment --image=nginx
```


**Display deployments:**
```sh
k get deployments
```


**Display pods:**
```sh
k get pods
```


**Read details on deployment:**
```sh
k describe deployment nginx-deployment
```


`Selector`: defines the connection of the PODs to deployment. PODs and deployment in k8s are separate objects. Here we need to know how to assign PODs to a deployment.
>ie. Selector: app=nginx-deployment


**Describe the pods (incl. replica set):**
```sh
k describe pod nginx-deployment-<pod-id>
```

* Note: The label is the key. Pods have labels, which are key-value pairs, and Deployments use selectors to find Pods that have matching labels. This is how Kubernetes establishes the link between a Deployment and the Pods it manages.


**Scale your pods to 3 replicas:**
```sh
k scale deployment nginx-deployment --replicas=3
```


**Display all pods with details:**
```sh
k get pods -o wide
```

* Note: You should not rely on ip-addresseses of the pods if you would like to connect to a specific port. Therefore, it's not convenient to utilize such IP addresses. And you should utilize some sort of other IP addresses which are managed by Kubernetes and which allow you to connect to any of the pods inside of the deployment.

---

### 🧩 Kubernetes Services

- **Services** in Kubernetes let you connect to deployments using a stable IP address.
- A **ClusterIP** is the default type—it gives a single internal IP to a deployment, accessible only within the cluster.
- This IP is shared across all pods in the deployment, making it easier than connecting to individual pod IPs.
- To expose a deployment externally, you can use:
  - The **node’s IP address**
  - A **LoadBalancer**, which provides one external IP for the whole deployment
- **LoadBalancer IPs** are typically managed by cloud providers (e.g., AWS, GCP) via the **Cloud Controller Manager** running on the master node.

Inside of the Kubernetes cluster it is possible to have multiple nodes and pods could be distributed across different nodes. Therefore the most common solution is to have a `LoadBalancer IP address` which will be just single IP-address for entire Kubernetes cluster for specific deployment. Thus, allowing you to connect to your deployment no matter where pods are created using just `single external IP address`.

But such LoadBalancer IP addresses are usually assigned by a specific cloud provider like AWS or GoogleCloud and such assignments are managed by *Cloud Controller Manager*, this service which is running on the master node. 



**Create a k8s service to expose the deployment:**
```sh
k expose deployment nginx-deployment --port=8080 --target-port=80
```


**Check if connection can be established (inside node):**
```sh
minikube ssh
curl <ip-address>:8080
```



**Display info on services in your cluster:**
```sh
k get svc
# or
k get service
```

### 🧩 Deployment & Service Delete
>k delete deployment 'deployment-name'
>k delete service 'service-name'

---

###  🧩 Deploying using your Custom Image

**Step 1. Initialize a new Node.js project:**
```sh
npm init -y
```


**Step 2. Install Express:**
```sh
npm install express
```


**Step 3. Write a simple Node.js application:**
```js
// Import the Express module
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

**Step 4. Containerizing with Docker**
**Dockerfile:**
```Dockerfile
# 🧱 Base image: lightweight Node.js on Alpine Linux
FROM node:18-alpine
LABEL maintainer="shiela.catapan@vanderlande.com"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
```


**🧼 Bonus: .dockerignore file**
To keep the image clean and fast to build, add a `.dockerignore` file:
```dockerignore
node_modules
npm-debug.log
```


**Step 5. Build and tag the image:**
```sh
docker build -t smcatapan/k8s-web-hello .
```


If the tag is not yet created:
```sh
docker tag k8s-web-hello smcatapan/k8s-web-hello:latest
# (replace smcatapan with your DockerHub username)
```


**Step 6. Push the tagged image to Docker Hub:**
```sh
docker push smcatapan/k8s-web-hello:latest
```


**Step 7. Deploy to Kubernetes with 3 replicas:**
```sh
k create deployment k8s-web-hello-deployment --image=smcatapan/k8s-web-hello:latest --replicas=3
```


**Step 8. Create a ClusterIP Service for your deployment:**
```sh
k expose deployment k8s-web-hello-deployment --type=ClusterIP --port=3000
```

---

### 🧩 NodePort Service
A `NodePort` service in Kubernetes is a way to expose your application running inside the cluster to the outside world.

A NodePort service opens a specific port (the "NodePort") on every node (server) in your cluster. When someone sends traffic to any node’s IP address at that port, Kubernetes forwards it to your app. This makes your app accessible from outside the cluster, using `<NodeIP>:<NodePort>`.


**Create a NodePort service:**
```sh
k expose deployment k8s-web-hello-deployment --type=NodePort --port=3000
```


**Access your Deployment Service in a browser:**
```sh
minikube service k8s-web-hello-deployment
```

NOTE:  Because of running Minikube with the Docker driver on macOS (Darwin).
- NodePort services are only accessible inside the Minikube container, not directly from your Mac.
- To access the service from your local machine, Minikube sets up a "tunnel" (proxy).
- This tunnel lets you reach the service using a localhost (127.0.0.1) URL provided by Minikube.
- Keep the terminal open while the tunnel is running, or the connection will close.
- Otherwise, if youre using VM drivers in your minikube, you can directly use the 'NodeIP' + "PORT" directly into your web browser.


**Create a LoadBalancer Service:**
```sh
k expose deployment k8s-web-hello-deployment --type=LoadBalancer --port=3000
```

Note:
- A LoadBalancer service gives you a single external IP and automatically spreads traffic across all your pods, ensuring even load and high availability. NodePort just opens a port on each node, but doesn’t balance traffic—clients must pick a node themselves. LoadBalancer is better for real load distribution and easy access.

### 🧩 Rolling Updates and Pods Recovery

**Step 1. Update source code & build new image (e.g., 2.0.0):**
```sh
docker build -t smcatapan/k8s-web-hello:2.0.0 .
docker images
docker push smcatapan/k8s-web-hello:2.0.0
```


**Step 2. Check in Docker Hub if the new tag is present.**


**Step 3. Get deployment YAML spec:**
```sh
k get deployment k8s-web-hello-deployment -o yaml
# Copy the value in spec.template.spec.containers.name
```


**Step 4. Change the image tag for rolling update:**
```sh
k set image deployment k8s-web-hello-deployment <container-name>=smcatapan/k8s-web-hello:2.0.0
```


**Step 5. Monitor rollout status:**
```sh
k rollout status deployment k8s-web-hello-deployment
```


**Step 6. See the new AGE of the pods:**
```sh
k get pods -o wide
```


**Step 7. Check if changes are reflected:**
```sh
k get svc
minikube service k8s-web-hello-deployment
```


**Step 8. Rollback to the latest version:**
```sh
k set image deployment k8s-web-hello-deployment <container-name>=smcatapan/k8s-web-hello
```


**Delete all deployments/services/pods:**
```sh
k delete all --all
```


---

### YAML Specification Files
- Create `deployment.yaml`
- Create `service.yaml`
- [Kubernetes DeploymentSpec Reference](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/deployment-v1/#DeploymentSpec)


---

### 🧩 Multiple Deployments Creation

**Cleanup by deleting the current deployment and services:**
```sh
k delete -f deployment.yaml -f service.yaml
```


Copy the original project and create a new one called `k8s-web-nginx`.
Go to the folder `k8s-web-nginx` & combine the 2 specs (service spec & deployment spec) in 1 yaml file.
> Always add the separator `---` as a border of each spec in your yaml file.


Edit the Node.js code to add communication from web-hello (triggered by a call from outside the cluster) to the nginx server (exposed via ClusterIP). The web-hello will then respond with the nginx server's response.
```js
// Connect to another service
app.get('/nginx', async (req, res) => {
  const url = 'http://nginx';
  try {
    const response = await fetch(url);
    const data = await response.text();
    res.send(`Response from Nginx service: ${data}`);
  } catch (error) {
    res.status(500).send(`Error connecting to Nginx service: ${error.message}`);
  }
});
```

Save the changes and install dependencies:
```sh
npm install <package>
```


Build the image & push the new image to your Docker Hub (see above steps for reference).


Update the new specs for web-app and nginx (i.e., ports, the correct image for web-app & nginx).
Apply the 2 new specs in 1 command:
```sh
k apply -f k8s-web-to-nginx.yaml -f nginx.yaml
```


**DNS resolution (see what IP is used by your nginx server):**
```sh
k exec <web-to-nginx-pod> -- nslookup nginx
```


Try to execute a command in one of the web-app pods to get a response directly from nginx (via ClusterIP). You should see the default nginx response HTML.
```sh
k exec <web-to-nginx-pod> -- wget -qO- http://nginx
```

---

## File Structure

```text
core/
  k8s-web-hello/
    app.js
    Dockerfile
    package.json
  k8s-web-nginx/
    app.js
    Dockerfile
    package.json
  deployment.yaml
  service.yaml
  k8s-web-to-nginx.yaml
  nginx.yaml
.gitignore
readme-phase1-core.md
```

---

## 🚀 Applying Kubernetes Manifests

To deploy resources defined in YAML files:
```sh
kubectl apply -f core/deployment.yaml
kubectl apply -f core/service.yaml
```
Or apply all manifests in the folder at once:
```sh
kubectl apply -f core/
```

---

## Troubleshooting

- **Minikube fails to start:** Try `minikube delete` then `minikube start --driver=docker`.
- **Pods not running:** Check logs with `kubectl logs <pod-name>`.
- **Service not accessible:** Ensure the correct ports are exposed and use `minikube service <service-name>` to access.
- **Port conflicts:** Make sure no other process is using the same port on your host.
- **YAML errors:** Validate your YAML files with `kubectl apply --dry-run=client -f <file>`.

---

## References
- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)


