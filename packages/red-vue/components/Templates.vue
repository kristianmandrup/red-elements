<template>
  <div id="templates">
    <script type="text/x-red" data-template-name="subflow">
      <div class="form-row">
        <label for="node-input-name" data-i18n="[append]editor:common.label.name">
          <i class="fa fa-tag"></i>
        </label>
        <input type="text" id="node-input-name">
      </div>
    </script>

    <script type="text/x-red" data-template-name="subflow-template">
      <div class="form-row">
        <i class="fa fa-tag"></i>
        <label for="subflow-input-name" data-i18n="common.label.name"></label><input type="text" id="subflow-input-name">
      </div>
      <div class="form-row" style="margin-bottom: 0px;">
        <label for="subflow-input-info" data-i18n="editor:subflow.info"></label>
        <a href="https://help.github.com/articles/markdown-basics/" style="font-size: 0.8em; float: right;" data-i18n="[html]subflow.format"></a>
      </div>
      <div class="form-row node-text-editor-row">
        <div style="height: 250px;" class="node-text-editor" id="subflow-input-info-editor"></div>
      </div>
      <div class="form-row form-tips" id="subflow-dialog-user-count"></div>
    </script>

    <script type="text/x-red" data-template-name="_expression">
      <div class="form-row node-text-editor-row">
        <div style="height: 200px;min-height: 150px;" class="node-text-editor" id="node-input-expression"></div>
      </div>
      <div class="form-row">
        <label for="node-input-expression-func" data-i18n="expressionEditor.functions"></label>
        <select id="node-input-expression-func"></select>
        <button id="node-input-expression-func-insert" class="editor-button" data-i18n="expressionEditor.insert"></button>
        <div style="min-height: 200px;" id="node-input-expression-help"></div>
      </div>
    </script>

  </div>
</template>
<script>
const log = console.log
export default {
  name: 'templates',
  created() {
    log('templates')
  }

}
</script>
