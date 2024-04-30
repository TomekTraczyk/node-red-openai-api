const { response } = require("express");

let OpenaiApi = (function () {
  "use strict";

  const fs = require("fs");
  const OpenAI = require("openai").OpenAI;

  class OpenaiApi {
    constructor(apiKey, baseURL, organization) {
      this.clientParams = {
        apiKey: apiKey,
        baseURL: baseURL,
        organization: organization,
      };
    }

    // Begin Vector Store File functions
    async createVectorStoreFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.msg.payload;
      const response = await openai.beta.vectorStores.files.create(
        vector_store_id,
        params,
      );

      return response;
    }

    async listVectorStoreFiles(parameters){
      /* Returns a list of vector store files. */

      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.msg.payload;
      const list = await openai.beta.vectorStores.files.list(
        vector_store_id,
        params,
      );

      return [...list.data];
    }

    async retrieveVectorStoreFile(parameters){
      /* Retrieves a vector store file. */

      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, file_id} = parameters.msg.payload;
      const response = openai.beta.vectorStores.files.retrieve(vector_store_id, file_id);

      return response;

    }

    async deleteVectorStoreFile(parameters){
      /* Removes a file from the vector store. */

      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, file_id, ...params} = parameters.msg.payload;
      const response = openai.beta.vectorStores.files.del(vector_store_id, file_id, params);

      return response;
    }

    // End Vector Store File functions

    async createVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, ...params } = parameters.msg.payload;
      const response = await openai.beta.vectorStores.fileBatches.create(
        vector_store_id,
        params,
      );

      return response;
    }

    async retrieveVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, batch_id, ...params} = parameters.msg.payload
      const response = await openai.beta.vectorStores.fileBatches.retrieve(vector_store_id, batch_id, params);

      return response;
    }

    async cancelVectorStoreFileBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, batch_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.vectorStores.fileBatches.retrieve(
        vector_store_id,
        batch_id,
        params
      );

      return response;
    }

    async listVectorStoreBatchFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const { vector_store_id, batch_id, ...params } = parameters.msg.payload;
      const list = await openai.beta.vectorStores.fileBatches.listFiles(
        vector_store_id,
        batch_id,
        params,
      );
      const batchFiles = [...list.data];

      return batchFiles;
    }

    async createVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.vectorStores.create(parameters.msg.payload);

      return response;
    }

    async listVectorStores(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.beta.vectorStores.list(parameters.msg.payload);
      const vectorStores = [...list.data]

      return vectorStores;
    }

    async retrieveVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.vectorStores.retrieve(vector_store_id, params);

      return response;
    }

    async modifyVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.vectorStores.update(vector_store_id, params);

      return response;
    }

    async deleteVectorStore(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {vector_store_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.vectorStores.del(vector_store_id, params);

      return response;
    }

    async createBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.batches.create(parameters.msg.payload);

      return response;
    }

    async retrieveBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {batch_id, ...params} = parameters.msg.payload;
      const response = await openai.batches.retrieve(batch_id, params);

      return response;
    }

    async listBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.batches.list(parameters.msg.payload);
      const batches = [...list.data];

      return batches;
    }

    async cancelBatch(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {batch_id, ...params} = parameters.msg.payload;
      const response = await openai.batches.cancel(batch_id, params);

      return response;
    }

    async createChatCompletion(parameters) {
      const { _node, ...params } = parameters;
      const openai = new OpenAI(this.clientParams);
      const response = await openai.chat.completions.create(parameters.msg.payload);

      if (parameters.msg.payload.stream) {
        _node.status({
          fill: "green",
          shape: "dot",
          text: "OpenaiApi.status.streaming",
        });
        for await (const chunk of response) {
          if (typeof chunk === "object") {
            let { _msgid, ...newMsg } = parameters.msg;
            newMsg.payload = chunk;

            _node.send(newMsg);
          }
        }
        _node.status({});
      } else {
        return response;
      }
    }

    async createImage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.images.generate(parameters.msg.payload);

      return response;
    }

    async createImageEdit(parameters) {
      const openai = new OpenAI(this.clientParams);
      let {image, mask, ...params} = parameters.msg.payload;

      params.image = fs.createReadStream(image);
      if (mask) {
        params.mask = fs.createReadStream(mask);
      }
      const response = await openai.images.edit(params);

      return response;
    }

    async createImageVariation(parameters) {
      const openai = new OpenAI(this.clientParams);
      let {image, ...params} = parameters.msg.payload;

      params.image = fs.createReadStream(image);
      const response = await openai.images.createVariation(params);

      return response;
    }

    async createEmbedding(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.embeddings.create(parameters.msg.payload);

      return response;
    }

    async createSpeech(parameters) {
      const openai = new OpenAI(this.clientParams);
      const audio = await openai.audio.speech.create(parameters.msg.payload);
      const response = Buffer.from(await audio.arrayBuffer());

      return response;
    }

    async createTranscription(parameters) {
      const openai = new OpenAI(this.clientParams);
      let {file, ...params} = parameters.msg.payload;

      params.file = fs.createReadStream(file);

      const response = await openai.audio.transcriptions.create(params);

      return response;
    }

    async createTranslation(parameters) {
      const openai = new OpenAI(this.clientParams);
      let {file, ...params} = parameters.msg.payload;

      params.file =  fs.createReadStream(file);

      const response = await openai.audio.translations.create(params);

      return response;
    }

    async listFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.files.list(parameters.msg.payload);

      return [...list.data];
    }

    async createFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      let {file, ...params} = parameters.msg.payload;

      params.file = fs.createReadStream(file);

      const response = await openai.files.create(params);

      return response;
    }

    async deleteFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {file_id, ...params} = parameters.msg.payload;
      const response = await openai.files.del(file_id, params);

      return response;
    }

    async retrieveFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {file_id, ...params} = parameters.msg.payload;
      const response = await openai.files.retrieve(file_id, params);

      return response;
    }

    async downloadFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {file_id, ...params} = parameters.msg.payload;
      const response = await openai.files.content(file_id, params);

      return response;
    }

    async createFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.fineTuning.jobs.create(parameters.msg.payload);

      return response;
    }

    async listPaginatedFineTuningJobs(parameters) {
      const openai = new OpenAI(this.clientParams);
      const list = await openai.fineTuning.jobs.list(parameters.msg.payload);

      return [...list.data];
    }

    async retrieveFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {fine_tuning_job_id, ...params} = parameters.msg.payload;
      const response = await openai.fineTuning.jobs.retrieve(fine_tuning_job_id, params);

      return response;
    }

    async listFineTuningEvents(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {fine_tuning_job_id, ...params} = parameters.msg.payload;
      const list = await openai.fineTuning.jobs.listEvents(fine_tuning_job_id, params);

      return [...list.data];
    }

    async cancelFineTuningJob(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {fine_tuning_job_id, ...params} = parameters.msg.payload;
      const response = await openai.fineTuning.jobs.cancel(fine_tuning_job_id, params);

      return response;
    }

    async listModels(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.models.list();

      return response.body;
    }

    async retrieveModel(parameters) {
      const openai = new OpenAI(this.clientParams);
      const model = parameters.msg.payload.model;
      const response = await openai.models.retrieve(model);

      return response;
    }

    async deleteModel(parameters) {
      const openai = new OpenAI(this.clientParams);
      const model = parameters.msg.payload.model;
      const response = await openai.models.del(model);

      return response;
    }

    async createModeration(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.moderations.create(parameters.msg.payload);
      return response;
    }

    async listAssistants(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.assistants.list(parameters.msg.payload);

      return response.body;
    }

    async createAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.assistants.create(parameters.msg.payload);

      return response;
    }

    async getAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.assistants.retrieve(assistant_id, params);

      return response;
    }

    async modifyAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.assistants.update(assistant_id, params);

      return response;
    }

    async deleteAssistant(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, ...params} = parameters.msg.payload
      const response = await openai.beta.assistants.del(assistant_id, params);

      return response;
    }

    async createThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.threads.create(parameters.msg.payload);

      return response;
    }

    async getThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.retrieve(thread_id, params);

      return response;
    }

    async modifyThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.update(thread_id, params);

      return response;
    }

    async deleteThread(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.del(thread_id, params);

      return response;
    }

    async listMessages(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.messages.list(thread_id, params);

      return response.body;
    }

    async createMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.messages.create(thread_id, params);

      return response;
    }

    async getMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, message_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.messages.retrieve(
        thread_id,
        message_id,
        params
      );

      return response;
    }

    async modifyMessage(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, message_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.messages.update(thread_id, message_id, params);

      return response;
    }

    async createThreadAndRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const response = await openai.beta.threads.createAndRun(parameters.msg.payload);

      return response;
    }

    async listRuns(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.list(thred_id, params);

      return response.body;
    }

    async createRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.create(thread_id, params);

      return response;
    }

    async getRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, run_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.retrieve(thread_id, run_id, params);

      return response;
    }

    async modifyRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, run_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.update(thread_id, run_id, params);

      return response;
    }

    async submitToolOuputsToRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, run_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.submitToolOutputs(thread_id, run_id, params);

      return response;
    }

    async cancelRun(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, run_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.cancel(thread_id, run_id, params);

      return response;
    }

    async listRunSteps(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, run_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.steps.list(thread_id, run_id, params);

      return response.body;
    }

    async getRunStep(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, run_id, step_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.runs.steps.retrieve(thread_id, run_id, step_id, params);

      return response;
    }

    async listAssistantFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.assistants.files.list(assistant_id, params);

      return response.body;
    }

    async createAssistantFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.assistants.files.create(assistant_id, params);

      return response;
    }

    async getAssistantFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, file_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.assistants.files.retrieve(assistant_id, file_id, params);

      return response;
    }

    async deleteAssistantFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {assistant_id, file_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.assistants.files.del(assistant_id, file_id, params);

      return response;
    }

    async listMessageFiles(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, message_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.messages.files.list(thread_id, message_id, params);

      return response;
    }

    async getMessageFile(parameters) {
      const openai = new OpenAI(this.clientParams);
      const {thread_id, message_id, file_id, ...params} = parameters.msg.payload;
      const response = await openai.beta.threads.messages.files.retrieve(thread_id, message_id, file_id, params);

      return response;
    }
  }

  return OpenaiApi;
})();

exports.OpenaiApi = OpenaiApi;
