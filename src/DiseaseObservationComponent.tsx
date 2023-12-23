import React, { useEffect, useState } from 'react';
import ObservationService from './ObservationService.tsx'

//Componente principal que cria o html e estiliza com tailwind css e chama as api's do service.

function DiseaseObservationComponent() {
  const [nomePaciente, setNomePaciente] = useState('');
  const [studyId, setStudyId] = useState('');
  const [selectedOption, setSelectedOption] = useState(''); //Opção selecionada no painel do componente
  const [message, setMessage] = useState(''); //Mensagem a ser mostrada conforme resposta da api


  useEffect(() => { //Ao abrir a opção "Observação" que é este componente, será pego o studyId da url e a chamada para pegar o nome do paciente.
    const fetchData = async () => {
      try {
        const studyId = await ObservationService.getStudyId();

        if (studyId) {
          setStudyId(studyId);
          const nomePaciente = await ObservationService.getNomePaciente(studyId);
          setNomePaciente(nomePaciente);

        } else {
          console.log("O parâmetro studyId não foi encontrado na URL.");
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    };

    fetchData();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSave = async () => {
    try {
      if (selectedOption && studyId) {

        const response = await ObservationService.saveObservation(studyId, selectedOption, nomePaciente);

        if (response.status === 200) {
          setMessage('Salvo com sucesso!');
          console.log(response.status)
          } else {
          setMessage('Falha ao salvar. Tente novamente.');
          }
        } else {
          console.error("Nenhuma opção selecionada ou studyId não disponível.");
        }
      } catch (error) {
        console.error('Erro na requisição:', error);
        setMessage('Erro ao salvar. Tente novamente.');
      }
      setSelectedOption('');
      setTimeout(() => { //tempo para tirar a mensagem da tela
          setMessage('');
        }, 3000);
    };

  return (
    <div className='w-full text-center mt-5'>
      {nomePaciente !== null ? (
        <div>
          <div className="mb-4">
            <div className='flex justify-around'>
              <div
                onClick={() => handleOptionClick('Doença avançada')}
                className={`border-2 rounded-md p-2 cursor-pointer ${
                  selectedOption === 'Doença avançada' ? 'bg-white font-semibold' : 'text-white'
                } text-sm`}
              >
                Doença avançada
              </div>
              <div
                onClick={() => handleOptionClick('Doença leve')}
                className={`border-2 rounded-md p-2 cursor-pointer ${
                  selectedOption === 'Doença leve' ? 'bg-white font-semibold' : 'text-white'
                } text-sm`}
              >
                Doença leve
              </div>
              <div
                onClick={() => handleOptionClick('Sem doença')}
                className={`border-2 rounded-md p-2 cursor-pointer ${
                  selectedOption === 'Sem doença' ? 'bg-white font-semibold' : 'text-white'
                } text-sm`}
              >
                Sem doença
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-white text-gray-800 font-semibold py-2 px-4 rounded shadow"
            >
            Salvar
          </button>
          {message && <p className={message.includes('sucesso') ? 'text-green-500' : 'text-red-500'} mb-4 p-4>{message}</p>}
        </div>
      ) : (
        'Loading...'
      )}
    </div>
  );
}

export default DiseaseObservationComponent;
