import * as React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DiseaseObservationComponent from './DiseaseObservationComponent';
import ObservationService from './ObservationService';

//substitui os métodos getStudyId, getNomePaciente e saveObservation
//por funções simuladas que retornam valores fixos.

jest.mock('./ObservationService', () => ({
  __esModule: true,
  default: {
    getStudyId: jest.fn().mockResolvedValue('MockedStudyId'),
    getNomePaciente: jest.fn().mockResolvedValue('Mocked Patient Name'),
    saveObservation: jest.fn().mockResolvedValue({ status: 200 }),
  },
}));


/* Verifica se as funções getStudyId e getNomePaciente são chamadas
quando o componente é montado. Ele renderiza o componente e então aguarda até que as funções sejam chamadas. A função getNomePaciente é
verificada para ter sido chamada com o studyId mockado.*/

it('calls getStudyId and getNomePaciente on component mount', async () => {
    render(<DiseaseObservationComponent />);
    await waitFor(() => {
      act(() => {
        expect(ObservationService.getStudyId).toHaveBeenCalled();
        expect(ObservationService.getNomePaciente).toHaveBeenCalledWith('MockedStudyId');
      });
    });
  });


/* Este teste verifica se a função saveObservation é chamada quando o botão "Salvar" é clicado. Ele renderiza o componente, aguarda a chamada
para getStudyId, simula a seleção de uma opção de doença e o clique no botão "Salvar", e então aguarda até que a função saveObservation seja chamada com os
valores esperados.*/

  it('calls saveObservation when save button is clicked', async () => {
    const { getByText } = render(<DiseaseObservationComponent />);

    // Aguarde a chamada ao getStudyId
    await waitFor(() => {
      expect(ObservationService.getStudyId).toHaveBeenCalled();
    });

    // simula a seleção da opção e o clique no botão "Salvar"
    fireEvent.click(getByText('Sem doença'));
    fireEvent.click(getByText('Salvar'));

    // agurada a conclusão da chamada de saveObservation
    await waitFor(() => {
      expect(ObservationService.saveObservation).toHaveBeenCalledWith(
        'MockedStudyId',
        'Sem doença',
        'Mocked Patient Name'
      );
    });
  });


/*Este teste verifica se o componente é renderizado corretamente. Ele renderiza o componente e verifica se os botões
esperados estão presentes no documento. */

describe('DiseaseObservationComponent', () => {

  it('renders correctly', async () => {
    const { getByText } = render(<DiseaseObservationComponent />);

    expect(getByText('Doença avançada')).toBeInTheDocument();
    expect(getByText('Doença leve')).toBeInTheDocument();
    expect(getByText('Sem doença')).toBeInTheDocument();
  });


});


/* Simula que getStudyId retorna null durante a execução do teste. Ele captura os logs de erro para verificar
se a mensagem de erro esperada é registrada usando console.error.  */

it("Send a console.error when there is no studyId.", async () => {
  // Simula que getStudyId retorne null apenas durante este teste
  jest.spyOn(ObservationService, 'getStudyId').mockResolvedValueOnce(null);

  // Captura os logs de erro para verificar se a mensagem esperada é impressa
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  const { getByText } = render(<DiseaseObservationComponent />);

  fireEvent.click(getByText('Sem doença'));
  fireEvent.click(getByText('Salvar'));

  await waitFor(() => {
    expect(consoleErrorSpy).toHaveBeenCalledWith('Nenhuma opção selecionada ou studyId não disponível.');
  });
  // Restaura a implementação original de console.error após o teste
  consoleErrorSpy.mockRestore();
});
