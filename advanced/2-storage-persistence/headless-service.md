# 🧑‍🔬 Headless Services & StatefulSets in Kubernetes

## Table of Contents
- [🧑‍🔬 Headless Services \& StatefulSets in Kubernetes](#-headless-services--statefulsets-in-kubernetes)
	- [Table of Contents](#table-of-contents)
	- [🗂️ Overview](#️-overview)
	- [🧑‍🚀 What is a Headless Service?](#-what-is-a-headless-service)
	- [🏗️ StatefulSet with Headless Service](#️-statefulset-with-headless-service)
	- [🐚 Debugging with Curl Pod](#-debugging-with-curl-pod)
	- [📝 Tips \& Use Cases](#-tips--use-cases)
	- [📚 References](#-references)

---

## 🗂️ Overview
Headless services in Kubernetes let you directly discover and connect to individual pods, which is perfect for StatefulSets and apps needing stable network identity.

---

## 🧑‍🚀 What is a Headless Service?
- A service with `clusterIP: None`.
- No load balancing or single cluster IP—DNS returns pod IPs directly.
- Great for databases, queues, or any app needing direct pod-to-pod communication.

**Sample:**
```yaml
apiVersion: v1
kind: Service
metadata:
	name: color-svc
spec:
	clusterIP: None
	selector:
		app: color-api
	ports:
	- port: 80
		targetPort: 80
```

---

## 🏗️ StatefulSet with Headless Service
StatefulSets work perfectly with headless services, giving each pod a stable DNS name and persistent storage.

**Sample:**
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
	name: color-ss
spec:
	selector:
		matchLabels:
			app: color-api
	serviceName: color-svc
	replicas: 3
	template:
		metadata:
			labels:
				app: color-api
		spec:
			containers:
			- name: color-api
				image: lmacademy/color-api:1.2.1
				ports:
				- containerPort: 80
					name: web
				volumeMounts:
				- name: dummy-data
					mountPath: /tmp/data
	volumeClaimTemplates:
	- metadata:
			name: dummy-data
		spec:
			accessModes:
			 - ReadWriteOnce
			resources:
				requests:
					storage: 1Gi
```

---

## 🐚 Debugging with Curl Pod
You can deploy a simple pod with curl to test connectivity and DNS resolution inside your cluster.

**Sample:**
```yaml
apiVersion: v1
kind: Pod
metadata:
	name: curl
spec:
	containers:
	- name: curl
		image: lmacademy/alpine-curl:1.0.0
		resources:
			requests:
				cpu: 100m
				memory: 128Mi
			limits:
				cpu: 200m
				memory: 256Mi
```

---

## 📝 Tips & Use Cases
- 🧩 **Headless Service:** Use for direct pod discovery, databases, or clustered apps.
- 🏗️ **StatefulSet:** Each pod gets a stable DNS name like `color-ss-0.color-svc`, `color-ss-1.color-svc`, etc.
- 💾 **Persistent Storage:** Each pod gets its own volume for data isolation.
- 🐚 **Curl Pod:** Great for debugging DNS and service connectivity in your cluster.

---

## 📚 References
- [Kubernetes Headless Services](https://kubernetes.io/docs/concepts/services-networking/service/#headless-services)
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)


