$(document).ready(function () {
    const formatarData = data => {
        const dataObj = new Date(data);
        return dataObj.toLocaleDateString('pt-BR');
    };

    function formatarDataInput(data) {
        const dataObj = new Date(data);
        return dataObj.toISOString().split('T')[0];
    }

    function limparFormulario() {
        $('#modalNovoPedido input').prop('disabled', false).val('');
        $('#quantidadeProduto').val('1');
        $('#tabelaProdutos tbody').empty();
        $('#btnAdicionarProduto').show();
        $('#btnSalvarPedido').show();
        $('#sectionProdutoPedido').show();
        $('#tabelaProdutos thead th:last-child').show();
        $('#tabelaProdutos tbody tr td:last-child').show();
        $('#modalNovoPedidoTitulo').text('Novo pedido');
    }

    $('#btnNovoPedido').on('click', function () {
        limparFormulario();
        $('#modalNovoPedido').modal('show');
    });

    $('#valorProduto').mask('000.000.000,00', { reverse: true });

    $('#btnAdicionarProduto').on('click', function () {
        const codigo = $('#codigoProduto').val().trim();
        const descricao = $('#descricaoProduto').val().trim();
        const quantidade = $('#quantidadeProduto').val().trim();
        const valor = $('#valorProduto').val().trim();

        if (!codigo || !quantidade || !valor) {
            alert('Preencha todos os campos do produto.');
            return;
        }

        const linha = `
            <tr>
              <td>${codigo}</td>
              <td>${quantidade}</td>
              <td>${valor}</td>
              <td>${descricao}</td>
              <td>
                  <button type="button" class="btn btn-outline-danger btn-sm btnExcluirProduto" title="Excluir produto">
                    <i class="bi bi-trash"></i>
                  </button>
               </td>
            </tr>
        `;

        $('#tabelaProdutos tbody').append(linha);

        // limpa os campos
        $('#codigoProduto, #descricaoProduto, #valorProduto').val('');
        $('#quantidadeProduto').val('1');
    });

    $('#tabelaProdutos').on('click', '.btnExcluirProduto', function () {
        $(this).closest('tr').remove();
    });

    $('#btnCancelarPedido').on('click', limparFormulario);
    $('#modalNovoPedido').on('hidden.bs.modal', limparFormulario);

    $('#btnSalvarPedido').on('click', function () {
        const numero = $('#numeroPedido').val();
        const dataSolicitacao = $('#dataSolicitacaoPedido').val();
        const dataEntrega = $('#dataPrevistaPedido').val();
        const observacao = $('#observacaoPedido').val();

        if (!numero || !dataSolicitacao || !dataEntrega) {
            alert("Preencha os campos obrigatórios do pedido.");
            return;
        }

        const produtos = [];

        $('#tabelaProdutos tbody tr').each(function () {
            const tds = $(this).find('td');
            const valorFormatado = tds.eq(2).text().trim();
            const valorNumerico = valorFormatado.replace(/\./g, '').replace(',', '.');

            produtos.push({
                codigoProduto: tds.eq(0).text(),
                quantidade: tds.eq(1).text(),
                valor: valorNumerico,
                descricaoProduto: tds.eq(3).text()
            });
        });

        const pedido = {
            NumeroPedido: numero,
            DataSolicitacao: dataSolicitacao,
            DataEntregaPrevista: dataEntrega,
            Observacao: observacao,
            Produtos: produtos
        };

        $.ajax({
            url: '/Pedido/adicionarPedido',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(pedido),
            success: function (response) {
                if (response.success) {
                    carregarPedidos();
                    $('#modalNovoPedido').modal('hide');
                } else {
                    alert('Erro ao salvar pedido: ' + response.message);
                }
            },
            error: function () {
                alert('Erro ao comunicar com o servidor.');
            }
        });
    });

    function carregarPedidos() {
        $.ajax({
            url: '/Pedido/listar',
            type: 'GET',
            success: function (response) {
                const tbody = $('#tabelaPedidos tbody');
                tbody.empty();

                if (!response || response.length === 0) {
                    tbody.html('<tr><td colspan="5" class="text-center">Nenhum pedido encontrado.</td></tr>');
                    return;
                }

                response.forEach((pedido, index) => {
                    const linha = `
                    <tr data-index="${index}">
                      <td>${pedido.numeroPedido}</td>
                      <td>${formatarData(pedido.dataSolicitacao)}</td>
                      <td>${formatarData(pedido.dataEntregaPrevista)}</td>
                      <td>${pedido.observacao}</td>
                      <td>
                        <button type="button" class="btn btn-outline-info btn-sm btnVisualizarPedido" title="Visualizar pedido" data-index="${index}">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm btnExcluirPedido" title="Excluir pedido">
                            <i class="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                `;
                    tbody.append(linha);
                });
            },
            error: function () {
                alert('Erro ao carregar pedidos.');
            }
        });
    }

    $('#tabelaPedidos').on('click', '.btnVisualizarPedido', function () {
        const linha = $(this).closest('tr');
        const numeroPedido = linha.find('td').eq(0).text().trim();


        $.ajax({
            url: `/Pedido/buscarPorNumero/${numeroPedido}`,
            method: 'GET',
            contentType: 'application/json',
            success: function (pedido) {
                if (!pedido) {
                    alert('Pedido não encontrado.');
                    return;
                }

                // preenche os campos
                $('#numeroPedido').val(pedido.numeroPedido).prop('disabled', true);
                $('#dataSolicitacaoPedido').val(formatarDataInput(pedido.dataSolicitacao)).prop('disabled', true);
                $('#dataPrevistaPedido').val(formatarDataInput(pedido.dataEntregaPrevista)).prop('disabled', true);
                $('#observacaoPedido').val(pedido.observacao).prop('disabled', true);

                // esconde os botoes de adicionar e salvar
                $('#btnAdicionarProduto').hide();
                $('#btnSalvarPedido').hide();

                const tbody = $('#tabelaProdutos tbody');
                tbody.empty();

                pedido.produtos.forEach(item => {
                    const valorFormatado = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(item.valor);

                    const linha = `
                        <tr>
                          <td>${item.codigoProduto}</td>
                          <td>${item.quantidade}</td>
                          <td>${valorFormatado}</td>
                          <td>${item.descricaoProduto}</td>
                          <td></td>
                        </tr>
                        `;
                    tbody.append(linha);
                });


                $('#modalNovoPedidoTitulo').text('Visualizar pedido');
                $('#tabelaProdutos thead th:last-child').hide();
                $('#tabelaProdutos tbody tr td:last-child').hide();
                $('#modalNovoPedido').modal('show');
                $('#sectionProdutoPedido').hide();
            },
            error: function () {
                alert('Erro ao buscar os dados do pedido.');
            }
        });
    });


    $('#tabelaPedidos').on('click', '.btnExcluirPedido', function () {
        const linha = $(this).closest('tr');
        const numeroPedido = linha.find('td').eq(0).text().trim();

        if (!numeroPedido) {
            alert('Número do pedido não encontrado.');
            return;
        }

        if (!confirm('Tem certeza que deseja excluir este pedido?')) {
            return;
        }

        $.ajax({
            url: `/Pedido/deletarPorNumero/${numeroPedido}`,
            type: 'DELETE',
            success: function () {
                carregarPedidos();
            },
            error: function (xhr, status, error) {
                alert('Erro ao excluir pedido: ' + xhr.responseText || error);
            }
        });
    });

    carregarPedidos();
});