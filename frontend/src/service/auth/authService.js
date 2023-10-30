import { HttpClient } from '../../infra/HttpClient/HttpCliente'
import { tokenService } from "./tokenService";

export const authService = {
  async login({ username, password }) {
    return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login `, {
      method: 'Post',
      body: { username, password }
    })
      .then(async (respostaDoServidor) => {
        if (!respostaDoServidor.ok) throw new Error('Usuário ou senha inválido');
        const body = respostaDoServidor.body;
        tokenService.save(body.data.access_token);
        return body;
      })
      .then(async ({data}) =>{
        const { refresh_token } = data;

        const response = await HttpClient('/api/refresh',{
          method: 'POST',
          body:{
            refresh_token
          }
        });

        console.log(response);
        

      });

  },

  async getSession(ctx = null) {
    const token = await tokenService.get(ctx);
    console.log('token', token)
    return HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session `, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Não Autorizado!");
        return response.body.data;
      });
  }
}

