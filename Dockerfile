# Use Debian 12 (Bookworm) as the base image
FROM debian:bookworm

# Set environment variables for user creation
ENV USERNAME=d
ENV HOME_DIR=/home/$USERNAME
ENV PASSWORD=d

# Install sudo and set up the user 'd'
RUN apt-get update && \
    apt-get install -y sudo wget htop neovim aria2 w3m curl git screen iputils-ping  && \
    rm -rf /var/lib/apt/lists/* && \
    useradd --create-home --home-dir $HOME_DIR --shell /bin/bash $USERNAME && \
    echo "$USERNAME:$PASSWORD" | chpasswd && \
    echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USERNAME && \
    chmod 0440 /etc/sudoers.d/$USERNAME




WORKDIR /sdata

COPY deploy.sh /sdata/
COPY *.sh /sdata/



RUN mkdir  -p /sdata
RUN chmod 777 /sdata

RUN chmod 777 $HOME_DIR
RUN chmod 777 /root/

#RUN curl -fsSL https://code-server.dev/install.sh | sh



# Set the user 'd' as the default user for when the container starts
USER $USERNAME
WORKDIR $HOME_DIR





# Default command to run when starting the container
CMD ["/bin/bash","/sdata/deploy.sh"]
#CMD ["/bin/bash"]

