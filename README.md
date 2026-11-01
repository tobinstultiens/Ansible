# Ansible

This ansible repo contains all of the playbooks to replicate my home server.

## Requirements

- Ansible
- Server

## Configurations

In this project there is a vault.yml that is used this vault contains all the variables that are used to setup the server, this includes passwords configurations such as what domains, Etc.

## playbooks

This playbook configures my server and connects with the NAS so that it is added as a network drive.

```bash
ansible-playbook -Kk playbook.yml
```

This playbook is for deploying all my docker containers to my server.
```bash
ansible-playbook -Kk deploy.yml
```

This playbook installs k3s on the server. Everything inside the cluster is managed by Argo CD from the [homelab-gitops](https://github.com/tobinstultiens/homelab-gitops) repo; the kubeconfig is written to `~/.kube/homeserver.yaml`.
```bash
ansible-playbook -K k3s.yml
```

While services move over, docker traefik keeps ports 80/443 and forwards the hosts listed in `vars/k3s.yml` to the cluster.
