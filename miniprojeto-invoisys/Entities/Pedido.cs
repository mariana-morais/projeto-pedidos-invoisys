namespace miniprojeto_invoisys.Entities
{
    public class Produto
    {
        public string? CodigoProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal DescricaoProduto { get; set; }
        public decimal Valor { get; set; }
    }

    public class Pedido
    {
        public string? NumeroPedido { get; set; }
        public DateTime DataSolicitacao { get; set; }
        public DateTime DataEntregaPrevista { get; set; }
        public string? Observacao { get; set; }
        public List<Produto> Produtos { get; set; }
    }
}
