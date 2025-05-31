using System.Collections.Generic;
using miniprojeto_invoisys.DTO;
using miniprojeto_invoisys.Repository.Interfaces;
using miniprojeto_invoisys.Services.Interfaces;

namespace miniprojeto_invoisys.Services
{
    public class PedidoService : IPedidoService
    {
        private readonly IPedidoRepository _pedidoRepository;

        public PedidoService(IPedidoRepository pedidoRepository)
        {
            _pedidoRepository = pedidoRepository;
        }

        public List<PedidoDTO> ListarPedidos()
        {
            return _pedidoRepository.ListarPedidos();
        }

        public PedidoDTO ObterPorNumero(string numeroPedido)
        {
            return _pedidoRepository.ObterPorNumero(numeroPedido);
        }

        public void Adicionar(PedidoDTO pedido)
        {
            _pedidoRepository.Adicionar(pedido);
        }

        public void Excluir(string numeroPedido)
        {
            _pedidoRepository.Excluir(numeroPedido);
        }
    }
}
