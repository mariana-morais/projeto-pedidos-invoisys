using miniprojeto_invoisys.DTO;
using miniprojeto_invoisys.Entities;
using miniprojeto_invoisys.Repository.Interfaces;
using System.Text.Json;

namespace miniprojeto_invoisys.Repository
{
    public class PedidoRepository : IPedidoRepository
    {
        private readonly string _caminhoTxt = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "Pedidos.txt");

        public List<PedidoDTO> ListarPedidos()
        {
            if (!File.Exists(_caminhoTxt))
            {
                return new List<PedidoDTO>();
            }

            var json = File.ReadAllText(_caminhoTxt);

            // verifica se esta vazio ou com espaços em branco
            if (string.IsNullOrWhiteSpace(json))
            {
                return new List<PedidoDTO>();
            }

            return JsonSerializer.Deserialize<List<PedidoDTO>>(json) ?? new List<PedidoDTO>();
        }

        public PedidoDTO ObterPorNumero(string numeroPedido)
        {
            var pedidos = ListarPedidos();
            return pedidos.FirstOrDefault(p => p.NumeroPedido == numeroPedido);
        }

        public void Adicionar(PedidoDTO pedido)
        {
            var pedidos = ListarPedidos();
            pedidos.Add(pedido);
            SalvarPedidos(pedidos);
        }

        public void Excluir(string numeroPedido)
        {
            var pedidos = ListarPedidos();
            var pedido = pedidos.FirstOrDefault(p => p.NumeroPedido.ToString() == numeroPedido);
            if (pedido != null)
            {
                pedidos.Remove(pedido);
                SalvarPedidos(pedidos);
            }
        }

        private void SalvarPedidos(List<PedidoDTO> pedidos)
        {
            var json = JsonSerializer.Serialize(pedidos, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_caminhoTxt, json);
        }
    }
}
