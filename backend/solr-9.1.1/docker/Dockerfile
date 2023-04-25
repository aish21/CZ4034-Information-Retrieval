# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This file can be used to build an (unofficial) Docker image of Apache Solr.
#
# The primary purpose of this file, is for use by Solr developers, with a java/gradle development env, who
# wish to build customized -- or "patched" docker images of Solr.  For this type of usecase, this file
# will be used automatically by gradle to build docker images from your local src.
#   Example:
#     ./gradlew dockerBuild
#
# For most Solr users, using this Dockerfile is not recommended: pre-built docker images of Solr are 
# available at https://hub.docker.com/_/solr -- however this file can be used to build docker images from
# a Solr release artifact -- either from a remote TGZ file, or from an TGZ artifact you have downloaded
# locally.
#    Example:
#      docker build -f solr-X.Y.Z/docker/Dockerfile https://www.apache.org/dyn/closer.lua/solr/X.Y.Z/solr-X.Y.Z.tgz
#    Example:
#      docker build -f solr-X.Y.Z/docker/Dockerfile - < solr-X.Y.Z.tgz


ARG BASE_IMAGE=eclipse-temurin:17-jre-focal

FROM $BASE_IMAGE

COPY / /opt/

ARG SOLR_VERSION="9.1.1"


LABEL org.opencontainers.image.title="Apache Solr"
LABEL org.opencontainers.image.description="Apache Solr is the popular, blazing-fast, open source search platform built on Apache Lucene."
LABEL org.opencontainers.image.authors="The Apache Solr Project"
LABEL org.opencontainers.image.url="https://solr.apache.org"
LABEL org.opencontainers.image.source="https://github.com/apache/solr"
LABEL org.opencontainers.image.documentation="https://solr.apache.org/guide/"
LABEL org.opencontainers.image.version="${SOLR_VERSION}"
LABEL org.opencontainers.image.licenses="Apache-2.0"

ENV SOLR_USER="solr" \
    SOLR_UID="8983" \
    SOLR_GROUP="solr" \
    SOLR_GID="8983" \
    PATH="/opt/solr/bin:/opt/solr/docker/scripts:/opt/solr/prometheus-exporter/bin:$PATH" \
    SOLR_INCLUDE=/etc/default/solr.in.sh \
    SOLR_HOME=/var/solr/data \
    SOLR_PID_DIR=/var/solr \
    SOLR_LOGS_DIR=/var/solr/logs \
    LOG4J_PROPS=/var/solr/log4j2.xml \
    SOLR_JETTY_HOST="0.0.0.0"

RUN set -ex; \
  groupadd -r --gid "$SOLR_GID" "$SOLR_GROUP"; \
  useradd -r --uid "$SOLR_UID" --gid "$SOLR_GID" "$SOLR_USER"

# add symlink to /opt/solr, remove what we don't want.
# Remove the Dockerfile because it might not represent the dockerfile that was used to generate the image.
RUN set -ex; \
  (cd /opt; ln -s solr-*/ solr); \
  rm -Rf /opt/solr/docs /opt/solr/docker/Dockerfile;

RUN set -ex; \
  mkdir -p /opt/solr/server/solr/lib /docker-entrypoint-initdb.d; \
  cp /opt/solr/bin/solr.in.sh /etc/default/solr.in.sh; \
  mv /opt/solr/bin/solr.in.sh /opt/solr/bin/solr.in.sh.orig; \
  mv /opt/solr/bin/solr.in.cmd /opt/solr/bin/solr.in.cmd.orig; \
  chmod 0664 /etc/default/solr.in.sh; \
  mkdir -p -m0770 /var/solr; \
  chown -R "$SOLR_USER:0" /var/solr; \
  ln -s /opt/solr/modules /opt/solr/contrib; \
  ln -s /opt/solr/prometheus-exporter /opt/solr/modules/prometheus-exporter;

RUN set -ex; \
    apt-get update; \
    apt-get -y install acl dirmngr lsof procps wget netcat gosu tini jattach; \
    rm -rf /var/lib/apt/lists/*;

VOLUME /var/solr
EXPOSE 8983
WORKDIR /opt/solr
USER $SOLR_UID

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["solr-foreground"]
