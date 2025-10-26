
## 🛠️ ConfigMaps: Decouple Your Config Like a Pro!

ConfigMaps let you inject non-sensitive config data into your pods—no more hardcoding!  
- Store key-value pairs (max 1MB).
- Use as environment variables or mount as files.
- Must be in the same namespace as your pod.

**Example: Create a ConfigMap**
```sh
k create configmap my-config --from-literal=app.color=blue
```

**Mount as Env Var in Pod YAML**
```yaml
env:
- name: APP_COLOR
	valueFrom:
		configMapKeyRef:
			name: my-config
			key: app.color
```

**Mount as File**
```yaml
volumes:
- name: config-vol
	configMap:
		name: my-config
```

**Pro Tip:**  
Set `immutable: true` to lock your config!  
```yaml
immutable: true
```

---

## 🔒 Secrets: Hide Your Sensitive Stuff!

Secrets store sensitive data (passwords, tokens) in base64—NOT encrypted by default!  
- Use RBAC for access control.
- Can be used as env vars or mounted as files.
- Must be in the same namespace as your pod.

**Example: Create a Secret**
```sh
k create secret generic db-creds \
	--from-literal=username=db_user \
	--from-literal=password=db_pass
```

**Access Secret in Pod YAML**
```yaml
env:
- name: DB_USER
	valueFrom:
		secretKeyRef:
			name: db-creds
			key: username
- name: DB_PASS
	valueFrom:
		secretKeyRef:
			name: db-creds
			key: password
```

**Show Secret (base64)**
```sh
k get secret db-creds -o yaml
```
**Decode Secret**
```sh
echo "ZGItdXNlcg==" | base64 --decode
```

**Pro Tip:**  
Never commit secrets to Git!  
Use cloud secret managers for extra security.  
Type `Opaque` = generic secret.

---

## 🧪 Demo Pod: Print Secrets (for learning only!)

```yaml
apiVersion: v1
kind: Pod
metadata:
	name: busybox-demo
spec:
	containers:
	- name: busybox
		image: busybox:1.36.0.1
		env:
		- name: DB_USER
			valueFrom:
				secretKeyRef:
					name: db-creds
					key: username
		- name: DB_PASS
			valueFrom:
				secretKeyRef:
					name: db-creds
					key: password
		command: ["sh", "-c", "echo $DB_USER && echo $DB_PASS && sleep 1800"]
```

**Apply and Check Logs**
```sh
k apply -f busybox-demo.yaml
k logs busybox-demo
```

---

## 📝 Quick Reference Table

| Resource   | Use Case         | k Command Example                | Mount Type         |
|------------|------------------|----------------------------------|--------------------|
| ConfigMap  | Non-sensitive    | k create configmap ...           | Env/File           |
| Secret     | Sensitive        | k create secret generic ...      | Env/File           |

---

## 🚦 Best Practices & Gotchas

- ConfigMaps/Secrets must be in the same namespace as your pod.
- Secrets are base64, NOT encrypted—protect access!
- Use RBAC for least privilege.
- Don’t print secrets in logs in production!  
- Use cloud secret managers for real apps.
