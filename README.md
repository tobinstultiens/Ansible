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
