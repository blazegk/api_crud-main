class BodyBuilder{
    constructor(nome, cpf, peso, altura, dataNascimento, sapato, dataBeijo, piriquito, gym, style){
        this.nome = nome
        this.cpf = cpf
        this.peso = peso
        this.altura = altura
        this.dataNascimento = dataNascimento
        this.sapato = sapato
        this.dataBeijo = dataBeijo
        this.piriquito = piriquito
        this.gym = gym;
        this.style = style; //associar o bodybuilder ao gym
    }
} 
module.exports = {BodyBuilder};