#!/bin/sh

export NAME_MACHINE=Char

eval $(docker-machine env $NAME_MACHINE)

export IP_MACHINE=`Docker-machine ip $NAME_MACHINE`
export IP_ONLINE=`ifconfig en0 | grep inet\ |  awk -F' ' '{print $2}'`

VBoxManage controlvm "$NAME_MACHINE" natpf1 "redtetris-server-dev,tcp,$IP_ONLINE,8080,$IP_MACHINE,8080"
VBoxManage controlvm "$NAME_MACHINE" natpf1 "redtetris-server-prod,tcp,$IP_ONLINE,3004,$IP_MACHINE,3004"