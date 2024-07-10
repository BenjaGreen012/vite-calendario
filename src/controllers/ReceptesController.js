const APIURL = 'https://app.nocodb.com/api/v2/tables/mzrez8biir12lbv/records';
const APINotas = 'https://app.nocodb.com/api/v2/tables/m0n77ue00c1jaj4/records';
const TOKEN = 'YyW9oupEhP-p23YRvn3PhPZcR7R77tAtncQAPaAz';

class ReceptesController {
    constructor() {
        this.apiUrl = APIURL;
        this.token = TOKEN;
    }

    async getAllUsers() {
        const response = await fetch(`${this.apiUrl}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'xc-token': this.token
            }
        });

        const data = await response.json();
        return data.list;
    }

    async getReceptaById(id) {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'xc-token': this.token
            }
        });

        const data = await response.json();
        return data;
    }

async getNotaByIdDate(fecha, userId) {
    const response = await fetch(`${APINotas}?where=(userId,eq,${userId})~and(fecha,eq,exactDate,${fecha})`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'xc-token': this.token
        }
    });
    const data = await response.json();
    return data.list;
}


    async createNota(fecha, record, userId) {
        const response = await fetch(`${APINotas}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xc-token': this.token
            },
            body: JSON.stringify({
                fecha: fecha,
                record: record,
                userId: userId
            })
        });

        const data = await response.json();
        return data;
       
    }

    async registerUser(username, password) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xc-token': this.token
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Error al registrar el usuario');
            }

            const data = await response.json();
            return data; // Aquí podrías retornar algún dato útil de la respuesta, si lo necesitas
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            throw error;
        }
    }

    async updateRecepta(id, nom, foto, descripcio) {
        const response = await fetch(`${this.apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'xc-token': this.token
            },
            body: JSON.stringify({
                nom,
                foto,
                descripcio
            })
        });

        const data = await response.json();
        return data;
    }

    async deleteRecepta(id) {
        const response = await fetch(`${this.apiUrl}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'xc-token': this.token
            },
            body: JSON.stringify({
                Id: id
            })
        });

        const data = await response.json();
        return data;
    }
}

export default ReceptesController;

/*
// Exemple d'ús:
const apiUrl = 'https://example.com/api';
const token = 'el_teu_token_aqui';

const receptesController = new ReceptesController(apiUrl, token);

// Obté totes les receptes
receptesController.getAllReceptes().then(data => console.log(data));

// Obté una recepta per ID
const receptaId = 1;
receptesController.getRecepteById(receptaId).then(data => console.log(data));

// Crea una nova recepta
const novaRecepta = {
    nom: 'Paella',
    foto: 'paella.jpg',
    descripcio: 'Una deliciosa paella'
};
receptesController.createRecepte(novaRecepta.nom, novaRecepta.foto, novaRecepta.descripcio).then(data => console.log(data));

// Actualitza una recepta existent
const receptaActualitzada = {
    id: 1,
    nom: 'Paella Valenciana',
    foto: 'paella_valenciana.jpg',
    descripcio: 'La veritable paella valenciana'
};
receptesController.updateRecepte(receptaActualitzada.id, receptaActualitzada.nom, receptaActual
*/
