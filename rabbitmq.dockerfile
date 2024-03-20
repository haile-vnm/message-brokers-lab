FROM rabbitmq:3-management

# enable new plugin by redefining the dockerfile for
# - extending the original docker image
# - instead of overiding the original enabled plugins
RUN rabbitmq-plugins enable --offline rabbitmq_stream
