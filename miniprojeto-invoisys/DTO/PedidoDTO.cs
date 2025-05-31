using System;
using System.Collections.Generic;

namespace miniprojeto_invoisys.DTO
{
    public class PedidoDTO
    {
        public string? NumeroPedido { get; set; }
        public DateTime DataSolicitacao { get; set; }
        public DateTime DataEntregaPrevista { get; set; }
        public string? Observacao { get; set; }
        public List<ItemPedidoDTO> Produtos { get; set; } = new();
    }
}
