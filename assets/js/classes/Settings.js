import { isEmpty } from "../modulos/utilitarios.js"

class Settings{
  options = {

  }

  constructor(){
    this.options = {
      "autocomplete": {
        "type": "boolean",
        "default": true,
        "propertie": "checked"
      },
      "theme": {
        "type": "string",
        "default": "normal",
        "propertie": "value"
      },
      "analyst": {
        "type": "string",
        "default": "",
        "propertie": "value"
      },
      "id-analyst": {
        "type": "string",
        "default": "#1",
        "propertie": "value"
      }
    }
  }

  CRUDoption(action, config_name, config_value){
    try{
      const settings_saved = JSON.parse(localStorage.getItem("cca-configs")) || "";
      
      if(isEmpty(settings_saved)){
        this.createSettingsObject(settings_saved);
      }

      switch(action.toLowerCase()){
        case "update":
        try{
          settings_saved[config_name] = config_value;
          localStorage.setItem("cca-configs", JSON.stringify(settings_saved));
        }catch(error){
          console.log("Um erro ocorreu ao alterar a configuração. Erro: %s", error);
        }
        break;
        
        case "read":
        default:
        return settings_saved[config_name] == "#" ? "" : settings_saved[config_name] ?? "";
        break;
      }

    }catch(error){
      this.createSettingsObject(JSON.parse(localStorage.getItem("cca-configs")) || "");
    }
  }
  
  // Criando o objeto no localStorage
  createSettingsObject(settings_saved){
    if(isEmpty(settings_saved)){
      try{
        let value = new Object();
        for(let option of Object.keys(this.options)){
          // Com os valores padrões
          value[option] = this.options[option]["default"];
        }
        localStorage.setItem("cca-configs", JSON.stringify(value));
      }catch(error){
        console.log("Ocorreu um erro ao criar o objeto em localStorage. Erro: %s", error);
      }
    }
  }

  optionIsValid(config_name){
    return (Object.keys(this.options).includes(config_name));
  }

  setOption(config_name, config_value){
    if(this.optionIsValid(config_name)){
      if(!isEmpty(config_value)){
        if(this.options[config_name]["type"] === "boolean" && [true, false].includes(config_value)){
          this.CRUDoption("update", config_name, config_value);
        }else if(this.options[config_name]["type"] === typeof config_value){
          this.CRUDoption("update", config_name, config_value.trim());
        }else{
          throw new Error("O valor informado para alterar a configuração não é válido.");
        }
      }else{
        this.CRUDoption("update", config_name, this.options[config_name]["default"]);
      }
      
      return this.CRUDoption("read", config_name);
    }
  }

  getOption(config_name){
    if(this.optionIsValid(config_name)){
      return this.CRUDoption("read", config_name)
    }

    return null;
  }

  getOptions(){
    return Object.keys(this.options);
  }

  getOptionsValues(){
    const ret = new Object();
    for(let item of Object.entries(this.options)){
      const values = this.CRUDoption("read", item[0]);

      if(isEmpty(values)){
        this.setOption(item[0]);
      }

      ret[item[0]] = {values: this.CRUDoption("read", item[0]), propertie: item[1]["propertie"]};
    }

    return ret;
  }
}

export{
  Settings
}