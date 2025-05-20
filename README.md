# Message Broker Lab

**Prerequisites**

Before proceeding, ensure that you have the following prerequisites installed:

1. **Docker:** Set up Docker on your system. You can download and install Docker from [Docker's official website](https://www.docker.com/get-started).

2. **Visual Studio Code (VSCode):** Install VSCode on your machine. You can download it from [Visual Studio Code's official website](https://code.visualstudio.com/download).

3. **Rest Client Extension for VSCode:** Install the [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension in VSCode. This extension allows you to make HTTP requests based on pre-configured settings.

## RabbitMQ

### Installation Steps for RabbitMQ Services

#### 1. Set Up Environment Files
   Copy the example environment files to create your own configuration.

   ```shell
   cp -R env.example env
   ```

#### 2. Run RabbitMQ Services
   Execute the following command to start RabbitMQ services. Adjust the arguments as needed.

   ```shell
   ARGS="file=rabbitmq/queue/worker queue=q-animals" docker compose -f docker-compose.rbmq.yml up
   ```

   This command initializes RabbitMQ services with specified parameters. You can observe logs for new message publications in the `q-animals` queue. If desired, you can change the queue name to process messages in a different queue (found in the `env/rabbitmq` file).

### Publishing Messages to RabbitMQ Using VSCode

In the `.rest-client` folder, find the `rabbitmq-publisher.http` file. To use it, ensure that you have the Rest Client extension installed in VSCode. This extension helps you make requests based on the pre-configured settings in the file.
