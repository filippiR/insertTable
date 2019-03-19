var insertTable = {
    lista: [],
    indiceLista: 0,
    buttonAdd: '#add',
    classBtExcluirLinha: 'btExcluirLinha',
    classBtEditarLinha: 'btEditarLinha',
    fields: [{inputId: '#UsuarioModalidade', fieldName: 'campo_id', empty: false}],
    tableId: '#tableId',
    modelName: 'Model',
    deleteLink: '',
    editLink: '',
    init: function () {
        $(this.buttonAdd).click(function () {
            insertTable.adicionarLinha();
            $.each(insertTable.fields, function (i, v) {
                if ($(v.inputId).is('select')) {
                    $(v.inputId).val($(v.inputId + " option:first").val());
                } else {
                    $(v.inputId).val('');
                }
            });
            return false;
        });
        if (this.lista.length > 0) {
            var line = [];
            $.each(this.lista, function (ind, val) {
                line = insertTable.montarLinhaList(val);
                insertTable.insertLine(line);
            });
        }

    },
    montarLinhaList: function (val) {
        var line = [];
        $.each(this.fields, function (ifields, field) {
            var text = val[field.fieldName];
            if ($(field.inputId).is('select')) {
                text = $(field.inputId + " option[value='" + val[field.fieldName] + "']").text();
            }
            var toPush = {inputId: field.inputId, value: val[field.fieldName], text: text, field: field.fieldName};
            line.push(toPush);
        });
        line.push({value: val.id, text: val.id, field: 'id'});
        return line;
    },
    addFuncBtRemLine: function () {
        $('.' + this.classBtExcluirLinha).unbind('click');
        $('.' + this.classBtExcluirLinha).click(function (e) {
            var selector = $(this);
            if (insertTable.deleteLink != '') {
                if ($(this).prev('.pk').val() != undefined) {
                    $.post(insertTable.deleteLink, {id: $(this).prev('.pk').val()}, function (data) {
                        if (data == 'OK') {
                            selector.parent().parent().remove();
                        }
                    }, 'html');
                } else {
                    $(this).parent().parent().remove();
                }
            } else {
                $(this).parent().parent().remove();
            }

            return false;
        });
    },
    editFuncBtEdit: function () {
        $('.' + this.classBtEditarLinha).unbind('click');
        $('.' + this.classBtEditarLinha).click(function (e) {
            e.preventDefault();
            var selector = $(this);
            var indice = selector.parent().parent().attr('indice');
            var inputs = selector.parent().children('input');
            var idbd = null;
            $.each(inputs, function (i, v) {
                $($(v).attr('inputorigin')).val($(v).val());
                if ($(v).attr('class') == 'pk') {
                    idbd = $(v).val();
                }
                $(insertTable.buttonAdd).hide();
            });
            $(insertTable.buttonAdd).parent().append('<button class="btn btn-warning" id="btEditar">Salvar</button');
            $('#btEditar').click(function (e) {
                e.preventDefault();
                insertTable.editarLinha(indice, idbd);
                return false;
            });
            return false;
        });
    },
    editarLinha: function (indice, idbd) {
        var linhas = [];
        var conti = true;
        if (idbd !== null) {
            var toPush = {inputId: 'undefined', value: idbd, text: null, field: 'id'};
            linhas.push(toPush);
        }
        var formPost = [];
        var formInput = {};
        $.each(this.fields, function (i, v) {
            if (conti == true) {
                var valido = true;
                if ($(v.inputId).attr('type') == 'text') {
                    var valText = $(v.inputId).val();
                } else {
                    var valText = $(v.inputId + ' option:selected').text();
                }
                var toPush = {inputId: v.inputId, value: $(v.inputId).val(), text: valText, field: v.fieldName};
                linhas.push(toPush);
                formInput[v.fieldName] = $(v.inputId).val();
                if (v.empty == false) {
                    valido = insertTable.validaInsert(toPush);
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
                    url: insertTable.editLink,
                    data: formInput,
                    dataType: 'json',
                    type: 'post',
                    success: function (data) {
                        if (data.erro == false) {
                            swal('Sucesso!', 'Registro editado com sucesso', 'success');
                            insertTable.editLine(indice, linhas);
                        } else {
                            swal('Erro!', 'Erro ao editar o registro', 'error');
                        }
                    }
                });
            } else {
                this.editLine(indice, linhas);
            }

        }
    },
    editLine: function (indice, values) {
        var tds = this.makeTds(values);
        tds += '<td>' + this.makeInputs(indice, values) + this.makeBtRemoveLine() + ' ' + this.makeBtEditLine(indice) + '</td>';
        $('.' + insertTable.modelName + '-' + indice).html(tds);
        this.addFuncBtRemLine();
        this.editFuncBtEdit();
        $.each(insertTable.fields, function (i, v) {
            $(v.inputId).val('');
        });
        $(insertTable.buttonAdd).show();
        $('#btEditar').remove();
    },
    adicionarLinha: function () {
        var linhas = [];
        var conti = true;
        $.each(this.fields, function (i, v) {
            if (conti == true) {
                var valido = true;
                if ($(v.inputId).attr('type') == 'text') {
                    var valText = $(v.inputId).val();
                } else {
                    var valText = $(v.inputId + ' option:selected').text();
                }
                var toPush = {inputId: v.inputId, value: $(v.inputId).val(), text: valText, field: v.fieldName};
                linhas.push(toPush);
                if (v.empty == false) {
                    valido = insertTable.validaInsert(toPush);
                }
                if (valido !== true) {
                    alert(valido);
                    conti = false;
                }
            }
        });
        if (conti == true) {
            this.insertLine(linhas);
        }

    },
    validaInsert: function (toPush) {
        if (toPush.value == '' || toPush.value == null) {
            return toPush.field + ' precisa ser selecionado(a).';
        }
        return true;
    },
    insertLine: function (values) {
        var indice = this.indiceLista;
        var tds = '<tr indice="' + indice + '" class="' + insertTable.modelName + '-' + indice + '">' + this.makeTds(values);
        tds += '<td>' + this.makeInputs(indice, values) + this.makeBtRemoveLine() + ' ' + this.makeBtEditLine(indice) + '</td></tr>';
        $(this.tableId + ' > tbody').append(tds);
        this.addFuncBtRemLine();
        this.editFuncBtEdit();
        this.indiceLista++;

    },
    makeTds: function (values) {
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
    },
    makeInputs: function (indice, values) {
        var saida = '';
        $.each(values, function (i, v) {
            var id = '';
            if (v.field == 'id') {
                id = 'class="pk"';
            }

            saida += '<input type="hidden" ' + id + ' inputorigin="' + v.inputId + '"  name="' + insertTable.modelName + '[' + indice + '][' + v.field + ']" value="' + v.value + '">';
        });
        return saida;
    },
    makeBtRemoveLine: function () {
        var btExcluirLinha = '<button class="btn btn-danger btn-sm ' + this.classBtExcluirLinha + '" title="Excluir">X</button>';
        return btExcluirLinha;
    },
    makeBtEditLine: function () {
        var btEditarLinha = '<button class="btn btn-warning btn-sm ' + this.classBtEditarLinha + '" title="Editar"><i class="fa fa-pencil"></i></button>';
        return btEditarLinha;
    }
};
