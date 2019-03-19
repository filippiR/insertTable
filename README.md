# insertTable

# Exexmple:
```html
 <div class="row">
   <div class="col-md-3">
     <?= $this->Form->input('usuario_id', ['label' => 'Participante', 'type' => 'select','options'=>$usuarios]) ?>
    </div>
    <div class="col-md-3">
     <?= $this->Form->input('nome_participante', ['type' => 'text']) ?>
    </div>
    <div class="col-md-3">
    <?= $this->Form->input('observacoes', ['type' => 'text','label'=>'Observações']) ?>
    </div>
    <div class="col-md-3">
     <div class="form-group">
      <label>&nbsp;</label><br />
      <?= $this->Html->link('Adicionar Participante', '#', ['id' => 'btAddParticipantes', 'class' => 'btn btn-default']) ?>
     </div>
    </div>
    <div class="clearfix">&nbsp;</div>
    </div>
    <div class="col-md-12">
    <table id='tabelaParticipantes' class="table table-bordered">
     <thead>
     <tr>
      <th>Nome</th>
      <th>Convidado</th>
      <th>Observação</th>
      <th>&nbsp;</th>
      </tr>
      </thead>
      <tbody>
      </tbody>
      </table>
      </div>
```
Script
```
<script>
<?php if (isset($reuniaoParticipantes) and count($reuniaoParticipantes) > 0): ?>
            insertTable.lista =<?= json_encode($reuniaoParticipantes); ?>;
<?php endif; ?>
        insertTable.buttonAdd = '#btAddParticipantes';
        insertTable.classBtExcluirLinha = 'btExcluirLinha';
        insertTable.fields = [
            {inputId: '#usuario-id', fieldName: 'usuario_id', empty: true},
            {inputId: '#nome-participante', fieldName: 'nome', empty: true},
            {inputId: '#observacoes', fieldName: 'observacao', empty: true}
            ];
        insertTable.tableId = '#tabelaParticipantes';
        insertTable.modelName = 'reuniao_participantes';
        insertTable.init();
        
        
     </script>
     ```
     
