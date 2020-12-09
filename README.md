# Comments Service

## Setup
### Part 1 - The Deployment
1. build the image after doing any change in the code
```docker build -t roccosada/comments .```

2. Push the new built image to the registry (dockerhub)
```docker push roccosada/comments```

3. Create a Deployment on the k8s module
Create a `infra/k8s/comments-depl.yaml` and type the Deployment definitions

4. Create a way to bring communication between Pods inside the cluster. It could be
a ClusterIP or a Node port (Service)

5. Restart the Deployment
```kubectl rollout restart deployment [deployment_name]```
In order to take the new built image

### Part 2 - The Service
1. In the previous `infra/k8s/comments-depl.yaml` add the Service definitions

### Part 3 - Apply the new definition in the cluster
```kubectl apply -f comments-depl.yaml```
from the infra/k8s folder, or just
```kubectl apply -f .```
to apply them all
