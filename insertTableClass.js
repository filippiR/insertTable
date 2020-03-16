/**
 * 
 * Exemplo de HTML com campos default
 *     <h4>Teste</h4>
    <div class="row">
        <div class="col-md-7">
            <?= $this->Form->input('campo-id', ['type' => 'text', 'label' => 'Campo']) ?>
        </div>

        <div class="col-md-3">
            <div class="form-group">
                <label>&nbsp;</label><br />
                <?= $this->Html->link('Adicionar', '#', ['id' => 'add', 'class' => 'btn btn-default']) ?>
            </div>
        </div>
        <div class="clearfix">&nbsp;</div>
    </div>
    <div class="col-md-12">
        <table id='tableId' class="table table-bordered">
            <thead>
                <tr>
                    <th>Campo</th>
                    <th>&nbsp;</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>

    <div class="clearfix"></div>

<script>
    var initParams = {
            buttonAdd: 'add',
            classBtExcluirLinha: 'btExcluirLinha',
            classBtEditarLinha: 'btEditarLinha',
            fields: [{ inputId: '#campo-id', fieldName: 'campo_id', empty: false }],
            tableId: '#tableId',
            modelName: 'model',
            deleteLink: '/controller/delete/',
            editLink: '/controller/edit',
            lista: [{campo_id:0}]
    };

     var tab = new InsertTable(initParams);
    tab.initRender();
</script>
 */


let InsertTable = (function () {
    let privateProps = new WeakMap();
    let lista = [];
    let indiceLista = 0;
    let countInsert = 0;
    let buttonAdd = 'add';
    let buttonEdit = '#btEditar';
    let classBtExcluirLinha = 'btExcluirLinha';
    let classBtEditarLinha = 'btEditarLinha';
    let fields = [{ inputId: '#campo-id', fieldName: 'campo_id', empty: false }];
    let tableId = '#tableId';
    let modelName = 'Model';
    let deleteLink = '';
    let editLink = '';
    class InsertTable {
        constructor(initParams) {
            // privateProps.set(this, { indiceLista: 0 });
            //Itens iniciais
            this.lista = initParams.lista != undefined ? initParams.lista : lista;
            this.indiceLista = initParams.indiceLista != undefined ? initParams.indiceLista : indiceLista;
            this.countInsert = initParams.countInsert != undefined ? initParams.countInsert : countInsert;
            //elementos Html
            this.buttonAdd = initParams.buttonAdd != undefined ? initParams.buttonAdd : buttonAdd;
            this.buttonEdit = initParams.buttonEdit != undefined ? initParams.buttonEdit : buttonEdit;
            this.classBtExcluirLinha = initParams.classBtExcluirLinha != undefined ? initParams.classBtExcluirLinha : classBtExcluirLinha;
            this.classBtEditarLinha = initParams.classBtEditarLinha != undefined ? initParams.classBtEditarLinha : classBtEditarLinha;
            this.tableId = initParams.tableId != undefined ? initParams.tableId : tableId;
            //dados do banco
            this.fields = initParams.fields != undefined ? initParams.fields : fields;
            this.modelName = initParams.modelName != undefined ? initParams.modelName : modelName;
            //urls de ajax
            this.deleteLink = initParams.deleteLink != undefined ? initParams.deleteLink : deleteLink;
            this.editLink = initParams.editLink != undefined ? initParams.editLink : editLink;
            //callbackFunctions
            this.callbackAdd = initParams.callbackAdd != undefined ? initParams.callbackAdd : function () { };
            this.callbackEdit = initParams.callbackEdit != undefined ? initParams.callbackEdit : function () { };
            this.callbackBeforeEdit = initParams.callbackBeforeEdit != undefined ? initParams.callbackBeforeEdit : function () { };
            this.callbackDelete = initParams.callbackDelete != undefined ? initParams.callbackDelete : function () { };
            // console.log(initParams);
            if( initParams.callbackBeforeAdd != undefined){
                this.callbackBeforeAdd = initParams.callbackBeforeAdd;
            }else{
                this.callbackBeforeAdd = function(){
                    return true;
                }
            }
        }
        setButtonAdd(val) {
            this.buttonAdd = val;
        }
        initRender() {
            let r = document.getElementById(this.buttonAdd);
            let obj = this;
            r.addEventListener('click', e => {
                e.preventDefault();
                obj.adicionarLinha();
                $.each(obj.fields, function (i, v) {
                    $(v.inputId).val('');
                });
                obj.callbackAdd();
                return false;
            });
            if (this.lista.length > 0) {
                var line = [];
                $.each(this.lista, function (ind, val) {
                    line = obj.montarLinhaList(val);
                    obj.insertLine(line);
                    //                this.insertOnTable(val.nome, val.id);
                    //                this.listaIds.push(val.id);
                });
            }
        }

        montarLinhaList(val) {
            var line = [];
            $.each(this.fields, function (ifields, field) {
                var text = val[field.fieldName];
                if ($(field.inputId).is('select')) {
                    text = $(field.inputId + " option[value='" + val[field.fieldName] + "']").text();
                }
                var toPush = { inputId: field.inputId, value: val[field.fieldName], text: text, field: field.fieldName };
                line.push(toPush);
            });
            if(val.id!==undefined){
                line.push({ value: val.id, text: val.id, field: 'id' });
            }
            return line;
        }


        adicionarLinha() {
            var linhas = [];
            var conti = true;
            let obj = this;
            $.each(this.fields, function (i, v) {
                if (conti == true) {
                    var valido = true;
                    if ($(v.inputId).attr('type') == 'text' || $(v.inputId).is('textarea')) {
                        var valText = $(v.inputId).val();
                    } else {
                        var valText = $(v.inputId + ' option:selected').text();
                    }
                    var toPush = { inputId: v.inputId, value: $(v.inputId).val(), text: valText, field: v.fieldName };
                    linhas.push(toPush);
                    if (v.empty == false) {
                        valido = obj.validaInsert(toPush);
                    }
                    if (valido !== true) {
                        alert(valido);
                        conti = false;
                    }
                }
            });
            if (conti == true) {
                obj.insertLine(linhas);
            }

        }
        validaInsert(toPush) {
            var saida = '';
            if (toPush.value == '' || toPush.value == null) {
                return toPush.field + ' precisa ser selecionado(a).';
            }
            
            return this.callbackBeforeAdd(this);
        }


        insertLine(values) {
            var indice = this.indiceLista;
            var tds = '<tr indice="' + indice + '" class="' + this.modelName + '-' + indice + '">' + this.makeTds(values);
            tds += '<td>' + this.makeInputs(indice, values) + this.makeBtRemoveLine() + ' ' + this.makeBtEditLine(indice) + '</td></tr>';
            $(this.tableId + ' > tbody').append(tds);
            this.addFuncBtRemLine();
            this.editFuncBtEdit();
            this.indiceLista++;
            this.countInsert++;

        }

        makeTds(values) {
            var saida = '';
            $.each(values, function (i, v) {
                if (v.field != 'id') {
                    if (v.text != undefined) {
                        saida += '<td>' + v.text + '</td>';
                    } else {
                        saida += '<td> &nbsp; </td>';
                    }
                }
            });
            return saida;
        }

        makeInputs(indice, values) {
            var saida = '';
            let obj = this;
            $.each(values, function (i, v) {
                var id = '';
                if (v.field == 'id') {
                    id = 'class="pk"';
                }
                var fieldClass = '';
                if (v.inputId)
                    fieldClass = v.inputId.replace('#', '');
                saida += '<input type="hidden" ' + id + ' class="classe' + fieldClass + '" inputorigin="' + v.inputId + '"  name="' + obj.modelName + '[' + indice + '][' + v.field + ']" value="' + v.value + '">';
            });
            return saida;
        }
        makeBtRemoveLine() {
            var btExcluirLinha = '<button class="btn btn-danger btn-sm ' + this.classBtExcluirLinha + '" title="Excluir"><i class="fas fa-trash"></i></button>';
            return btExcluirLinha;
        }
        makeBtEditLine() {
            var btEditarLinha = '<button class="btn btn-warning btn-sm ' + this.classBtEditarLinha + '" title="Editar"><i class="fas fa-pencil-alt"></i></button>';
            return btEditarLinha;
        }

        addFuncBtRemLine() {
            let obj = this;
            $('.' + this.classBtExcluirLinha).unbind('click');
            $('.' + this.classBtExcluirLinha).click(function (e) {
                var selector = $(this);
                var iddb = $(this).prev('.pk').val();
                if (obj.deleteLink != '' && iddb != undefined) {
                    $.post(obj.deleteLink, { id: $(this).prev('.pk').val() }, function (data) {
                        if (data == 'OK') {
                            selector.parent().parent().remove();
                            obj.countInsert--;
                            obj.callbackDelete();
                        }
                    }, 'html');
                } else {
                    $(this).parent().parent().remove();
                    obj.callbackDelete();
                }

                return false;
            });
        }

        editFuncBtEdit() {
            let obj = this;
            $('.' + this.classBtEditarLinha).unbind('click');
            $('.' + this.classBtEditarLinha).click(function (e) {
                e.preventDefault();
                if ($(obj.buttonEdit).length == 0) {
                    var selector = $(this);
                    var indice = selector.parent().parent().attr('indice');
                    var inputs = selector.parent().children('input');
                    var idbd = null;
                    $.each(inputs, function (i, v) {
                        $($(v).attr('inputorigin')).val($(v).val());
                        if ($(v).attr('class') == 'pk') {
                            idbd = $(v).val();
                        }
                        $('#' + obj.buttonAdd).hide();
                    });
                    var idbt = obj.buttonEdit.replace('#', '');
                    $('#' + obj.buttonAdd).parent().append('<button class="btn btn-warning" id="' + idbt + '">Salvar</button>');
                    $(obj.buttonEdit).click(function (e) {
                        e.preventDefault();
                        obj.editarLinha(indice, idbd);
                        

                        return false;
                    });
                    obj.callbackBeforeEdit();
                } else {
                    swal('Erro!', 'Conclua a edição anterior para editar o próximo item!', 'error');
                }
                return false;
            });
        }

        editarLinha(indice, idbd) {
            let obj = this;
            var selector = $(this);
            var inputs = selector.parent().children('input');
            var linhas = [];
            var conti = true;
            if (idbd !== null) {
                var toPush = { inputId: 'undefined', value: idbd, text: null, field: 'id' };
                linhas.push(toPush);
            }
            var formPost = [];
            var formInput = {};
            $.each(this.fields, function (i, v) {
                if (conti == true) {
                    var valido = true;
                    if ($(v.inputId).attr('type') == 'text' || $(v.inputId).is('textarea')) {
                        var valText = $(v.inputId).val();
                    } else {
                        var valText = $(v.inputId + ' option:selected').text();
                    }
                    var toPush = { inputId: v.inputId, value: $(v.inputId).val(), text: valText, field: v.fieldName };
                    linhas.push(toPush);
                    formInput[v.fieldName] = $(v.inputId).val();
                    if (v.empty == false) {
                        valido = obj.validaInsert(toPush);
                    }
                    if (valido !== true) {
                        alert(valido);
                        conti = false;
                    }
                }
            });
            if (conti == true) {
                if (idbd !== null && this.editLink != '') {
                    formInput['id'] = idbd;
                    $.ajax({
                        url: obj.editLink,
                        data: formInput,
                        dataType: 'json',
                        type: 'post',
                        success: function (data) {
                            if (data.erro == false) {
                                swal('Sucesso!', 'Registro editado com sucesso', 'success');
                                obj.editLine(indice, linhas);
                                obj.callbackEdit(indice, inputs);
                            } else {
                                swal('Erro!', 'Erro ao editar o registro', 'error');
                            }
                        }
                    });
                } else {
                    this.editLine(indice, linhas);
                    obj.callbackEdit(indice, inputs);
                }

            }
        }

        editLine(indice, values) {
            var tds = this.makeTds(values);
            tds += '<td>' + this.makeInputs(indice, values) + this.makeBtRemoveLine() + ' ' +
                this.makeBtEditLine(indice) + '</td>';
            $('.' + this.modelName + '-' + indice).html(tds);
            this.addFuncBtRemLine();
            this.editFuncBtEdit();
            $.each(this.fields, function (i, v) {
                $(v.inputId).val('');
            });
            $('#' + this.buttonAdd).show();
            $(this.buttonEdit).remove();
        }


    }
    return InsertTable;
})();
