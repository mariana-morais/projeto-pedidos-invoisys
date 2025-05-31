using System.Collections.Generic;
using System.Threading.Tasks;
using miniprojeto_invoisys.DTO;

namespace miniprojeto_invoisys.Repository.Interfaces
{
    public interface IPedidoRepository
    {
        List<PedidoDTO> ListarPedidos();
        PedidoDTO ObterPorNumero(string numeroPedido);
        void Adicionar(PedidoDTO pedido);
        void Excluir(string numeroPedido);
    }
}
