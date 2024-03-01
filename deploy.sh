#!/bin/bash

# Specify the Python version you want to install
PYTHON_VERSION=3.11
NODE_VERSION=20

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

nvm install $NODE_VERSION







git clone https://github.com/suisuyy/azuretts.git
cd azuretts
bash setup.sh
bash start.sh



wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
# Run the Miniconda installer
bash Miniconda3-latest-Linux-x86_64.sh -b -p $HOME/miniconda
# Initialize Miniconda
source "$HOME/miniconda/etc/profile.d/conda.sh"
# Create a new Conda environment with the specified Python version
conda create -n myenv python=$PYTHON_VERSION -y
# Activate the new environment
conda activate myenv
# Verify the Python installation
python --version


while true
do
  sleep 10
done

echo 'end deploay.sh'
