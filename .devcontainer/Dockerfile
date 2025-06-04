FROM node:20

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Ensure the node user has passwordless sudo access
RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# Set locale to avoid warnings
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
RUN apt-get update && apt-get install -y locales && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8

# Install PostgreSQL
RUN apt update && apt install -y postgresql postgresql-contrib

# Set up PostgreSQL user, password, and database
ENV POSTGRES_USER=devuser
ENV POSTGRES_PASSWORD=devpassword
ENV POSTGRES_DB=devdb
