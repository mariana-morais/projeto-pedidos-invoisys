using Microsoft.AspNetCore.Mvc;
using miniprojeto_invoisys.DTO;
using miniprojeto_invoisys.Services.Interfaces;

namespace miniprojeto_invoisys.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class PedidoController : ControllerBase
    {
        private readonly IPedidoService _pedidoService;

        public PedidoController(IPedidoService pedidoService)
        {
            _pedidoService = pedidoService;
        }

        [HttpGet("listar")]
        public IActionResult ObterPedidos()
        {
            var pedidos = _pedidoService.ListarPedidos();

            pedidos ??= new List<PedidoDTO>();

            return Ok(pedidos);
        }

        [HttpGet("buscarPorNumero/{numeroPedido}")]
        public IActionResult ObterNumeroPedido(string numeroPedido)
        {
            var pedido = _pedidoService.ObterPorNumero(numeroPedido);
            if (pedido == null)
            {
                return NotFound($"Pedido com número {numeroPedido} não encontrado.");
            }
            return Ok(pedido);
        }

        [HttpPost("adicionarPedido")]
        public IActionResult AdicionarPedido([FromBody] PedidoDTO pedido)
        {
            if (pedido == null)
            {
                return BadRequest("Dados do pedido inválidos.");
            }
            _pedidoService.Adicionar(pedido);
            return Ok(new
            {
                success = true,
                message = "Pedido adicionado com sucesso.",
                data = pedido
            });
        }

        [HttpDelete("deletarPorNumero/{numeroPedido}")]
        public IActionResult ExcluirPedido(string numeroPedido)
        {
            var pedido = _pedidoService.ObterPorNumero(numeroPedido);
            if (pedido == null)
            {
                return NotFound($"Pedido com número {numeroPedido} não encontrado.");
            }
            _pedidoService.Excluir(numeroPedido);
            return NoContent();
        }

    }
}
