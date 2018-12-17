#!/usr/bin/env bash

yarn build
yes | cp -r build/static/* ../mbs_server/static
yes | cp build/* ../mbs_server/static/
scp -r ../mbs_server/wechat mbs:/opt/mbs_server/
scp -r ../mbs_server/mbs mbs:/opt/mbs_server/
scp -r ../mbs_server/prize mbs:/opt/mbs_server/
scp -r ../mbs_server/player mbs:/opt/mbs_server/
scp -r ../mbs_server/game mbs:/opt/mbs_server/
scp -r ../mbs_server/static mbs:/opt/mbs_server/
ssh mbs 'sudo service gunicorn restart'