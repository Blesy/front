import React from 'react';
import '../assets/styles/components/Comentarios.scss';
import * as agent from 'superagent';
import { useState } from 'react';

const Comentarios = (props) => {
    const [comentarios, setComentarios] = useState([]);
    const [comentario, setComentario] = useState("");
    const change = (evt) => {
        setComentario(evt.target.value);
    }

    const get = async() => {
        await agent.get('http://localhost:600/getComents')
        .then((data) => {
            setComentarios(data.body)
        })
        .catch(function (error)
        {
            alert("No se puedieron cargar los comentarios.");
            if (error.response)
            {
                console.log(error.response.status);
            }
        });
    }

    const guardar = async () => {
        if (comentario.length < 5) {
            alert("Debe agregar mas texto")
            return;
        }
        await agent.post('http://localhost:600/saveComent')
        .send({
            comentario
        })
        .catch(function (error)
        {
            alert("No se pudo agregar su comentario.");
            if (error.response)
            {
                console.log(error.response.status);
            }
        }).finally(()=>{setComentario("");})
    }
    return (
        <div className="comentarios">
            <textarea name="comentario" id="agregar" value={comentario} onChange={change} cols="30" rows="10"/>
            <input type="button" id="btn" value="Agregar comentario" onClick={guardar}/>
            <input type="button" id="btn" value="Cargar comentarios" onClick={get}/>
            {
                comentarios.map((item) => 
                <p className="cargados">{item.comentario}</p>)
            }
        </div>
    )
};

export default Comentarios;