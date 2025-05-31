using miniprojeto_invoisys.DTO;

namespace miniprojeto_invoisys.Services.Interfaces
{
  public interface IPedidoService
    {

        List<PedidoDTO> ListarPedidos();
        PedidoDTO ObterPorNumero(string numeroPedido);
        void Adicionar(PedidoDTO pedido);
        void Excluir(string numeroPedido);
    }
}
