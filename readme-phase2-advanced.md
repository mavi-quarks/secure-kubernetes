# 🔐 Advanced Kubernetes - Security & Large Scale Deployments

## Table of Contents
- [🔐 Advanced Kubernetes - Security \& Large Scale Deployments](#-advanced-kubernetes---security--large-scale-deployments)
  - [Table of Contents](#table-of-contents)
    - [Managing K8s Resources](#managing-k8s-resources)
  - [Security, RBAC and Network Policies](#security-rbac-and-network-policies)
    - [Kubernetes Security Overview](#kubernetes-security-overview)
    - [Security Issues \& Certificates](#security-issues--certificates)
  - [Kubernetes](#kubernetes)
  - [File Structure](#file-structure)
  - [Troubleshooting](#troubleshooting)
  - [References](#references)

---
 
### Managing K8s Resources
*Labels & Selectors*: used to identify and group resources meaningfully.

*Labels*: key-value pairs attached to kubernetes objects (i.e., pods, nodes, service, replicasets, deployments). They provide metadata that helps identify and organize these objects.

*Selectors*: expressions used to filter k8s objects based on their labels. Selectors allow users and k8s components to target specific objects that match certain criteria.

Example:

**Labels**

| Pod 1 | Pod 2 | Pod 3|
|----------|----------|---------|
| labels:<br> &nbsp;&nbsp; app: color-api <br>  &nbsp;&nbsp;environment: dev <br> &nbsp;&nbsp; tier: frontend <br> &nbsp;&nbsp; release: stabe <br>  | labels:<br> &nbsp;&nbsp; app: color-api <br> &nbsp;&nbsp; environment: dev <br> &nbsp;&nbsp; tier: backend <br> &nbsp;&nbsp; release: sit <br>   | labels:<br>  &nbsp;&nbsp; app: ecomm <br> &nbsp;&nbsp; environment: prod <br> &nbsp;&nbsp; tier: backend <br> &nbsp;&nbsp; release: stable <br>   |

**Q1:** What pod/s are returned if the selector (equality-based & used either =, ==, or != ) is:
```
selector:
  matchlabels:
    app: color-api
    tier: backend
```
**A1: The Pod 2**

**Q2:** What pods are returned if the selector (set-based selector which uses operators like In, NotIn, Exists, DoesNotExist) is:
```
selector:
  matchExpressions:
    - key: environment
      operator: NotIn
      values: [dev]
```
**A2: The Pod 3**

Apply and deploy the pods created at *~/color-api.yaml*
>k apply -f color-api.yaml

Use the label tier to only filter pods 'backend' during display
>k get pods -l tier=backend

**Multiple Queries**
Filter  tier and app where tier is frontend and app is named color-api
>k get pods -l 'tier=frontend,app=color-api'

Filter the tier to only display pods in the list
>k get pods -l 'tier in (frontend)'

Delete all resources created.
>k delete -f color-api.yaml

Also, makes use of the property 'matchExpressions' when defining your deployment spec so that it will be only doing things under 'managed'
```
spec:
  replicas: 3
  selector:
    matchLabels:
      app: color-api
      environment: local
      tier: backend
    matchExpressions:
      - key: managed
        operator: Exists
  template:
    metadata:
      labels:     
        app: color-api
        environment: local
        tier: backend
        managed: 'deployment'
```

---
## Security, RBAC and Network Policies
they are cryptographic keys that:

**Q: What are certificates?**

**A:** Certificates are cryptographic keys that:
  - Ensure secure communication
  - Authenticate with encryption

To interact with you kubernetes cluster securely, you must include the ff. in your Context creation:
  - Cluster's API server URL
  - Paths to appropriate certificate files
  - Client certificate and key

And then you can setup your kubectl configuration to use this context.

### Kubernetes Security Overview
Kubernetes security encompasses:

**1. Authentication**
  - Certificates, tokens, OpenID Connect
  - Verify identity
  
**2. Authorization**
  - Define permissible actions
  - RBAC

**3. Network Policies**
  - Control communication
  - Enhance security

**4. Secrets**
  - Store and manage sensitive information
  - API tokens/ passwords

### Security Issues & Certificates
|  |  |  |  |
|----------|----------|----------|----------|
| ISSUES   | Certificate expiry   | Unauthorized access  | Man-in-the-Middle Attacks   |
| MITIGATIONS   | Require regular renewal or rotation   | Certificate management   | Use strong, trusted certificates   |

## Kubernetes 
**yyy**
  - Certificates
---

## File Structure
---

## Troubleshooting
---

## References
---
