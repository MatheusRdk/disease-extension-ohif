class ObservationService {

  //Classe de serviço para as chamadas de API e pegar o studyId da url.

  static async getNomePaciente(studyId) { //Usa o studyId para pegar o nome do paciente por meio da api do dcm4chee
    const url = `http://localhost:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${studyId}/metadata`;
    const response = await fetch(url);
    const dataNomePaciente = await response.json();
    return dataNomePaciente[0]['00100020']['Value'];
  }

  static async getStudyId() { //Pega o studyId da url
    const currentURL = window.location.href;
    const match = currentURL.match(/StudyInstanceUIDs=([^&]*)/);
    const studyId = match && match[1];
    return studyId;
  }

  static async saveObservation(studyId, selectedOption, nomePaciente) { //Salva a observaçào da doença como um atributo do estudo, com a api do dcm4chee
    const url = `http://localhost:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${studyId}`;
    const headers = new Headers({ "Content-Type": "application/dicom+json" });

    const observationData = {
      "00102000": { vr: "LO", Value: selectedOption },
      "0020000D": { vr: "UI", Value: studyId },
      "00100020": { vr: "LO", Value: nomePaciente }
    };

    const requestOptions = {
      method: 'PUT',
      headers,
      body: JSON.stringify(observationData),
      redirect: 'follow' as RequestRedirect
    };

    return fetch(url, requestOptions);
  }
}

export default ObservationService;
