const diseaseDatabase = {
    "Gripe": {
      symptoms: ["fiebre", "tos", "dolor de garganta"],
      description: "Los primeros días, una persona con gripe puede experimentar fiebre alta, dolor de garganta, y tos persistente. También puede sentir debilidad general y dolores musculares."
    },
    "Migraña": {
      symptoms: ["dolor de cabeza", "náuseas", "sensibilidad a la luz"],
      description: "En los primeros tres días, una persona con migraña puede sufrir intensos dolores de cabeza, a menudo acompañados de náuseas y una gran sensibilidad a la luz y al sonido."
    },
    "COVID-19": {
      symptoms: ["fiebre", "tos", "dificultad para respirar", "pérdida del olfato"],
      description: "Durante los primeros días, una persona con COVID-19 puede experimentar fiebre, tos seca, y dificultad para respirar. Otros síntomas pueden incluir pérdida del olfato y del gusto."
    },
    "Alergia": {
      symptoms: ["estornudos", "picazón", "ojos llorosos"],
      description: "Al inicio, una persona con alergia puede experimentar estornudos frecuentes, picazón en la nariz y los ojos, y ojos llorosos. Los síntomas pueden variar en intensidad."
    },
    "Dengue": {
      symptoms: ["fiebre alta", "dolor muscular", "erupción cutánea"],
      description: "En los primeros días, el dengue puede causar fiebre alta, dolor muscular y articular severo, y una erupción cutánea. La persona puede sentirse extremadamente fatigada."
    },
    "Gastroenteritis": {
      symptoms: ["dolor abdominal", "diarrea", "vómitos"],
      description: "Durante los primeros tres días, una persona con gastroenteritis puede sufrir de dolor abdominal, diarrea y vómitos frecuentes, lo que puede llevar a la deshidratación."
    }
  };
  
  const symptomList = {
    "General": ["fiebre", "tos", "dolor de garganta"],
    "Neurológico": ["dolor de cabeza", "náuseas", "sensibilidad a la luz"],
    "Respiratorio": ["dificultad para respirar", "pérdida del olfato"],
    "Alergias": ["estornudos", "picazón", "ojos llorosos"],
    "Infecciosas": ["fiebre alta", "dolor muscular", "erupción cutánea"],
    "Digestivo": ["dolor abdominal", "diarrea", "vómitos"],
    // Agrega más categorías y síntomas aquí
  };
  
  export { diseaseDatabase, symptomList };
  