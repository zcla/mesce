# https://github.com/scottbass/Powershell/blob/master/Scripts/Read-MsAccessData.ps
Function Read-MsAccessData() {
    param(
        [Parameter(
           Position=0,
           Mandatory=$true
        )]
        [String]$Path
        ,
        [Alias("query")]
        [Parameter(
           Position=1,
           Mandatory=$true
        )]
        [String]$SqlQuery
     )
     #endregion
     
     $ErrorActionPreference = "Stop"
     
     #$adOpenStatic = 3
     #$adLockOptimistic = 3
     
     $SqlConnection = New-Object System.Data.OleDb.OleDbConnection
     $SqlConnection.ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0; Data Source=$path"
     $SqlCmd = New-Object System.Data.OleDb.OleDbCommand
     $SqlCmd.CommandText = $SqlQuery
     $SqlCmd.Connection = $SqlConnection
     $SqlAdapter = New-Object System.Data.OleDb.OleDbDataAdapter
     $SqlAdapter.SelectCommand = $SqlCmd
     $DataSet = New-Object System.Data.DataSet
     $nRecs = $SqlAdapter.Fill($DataSet)
     $nRecs | Out-Null
     
     # Populate Hash Table
     $objTable = $DataSet.Tables[0]
     
     # Return results to console (pipe console output to Out-File cmdlet to create a file)
    Return $objTable
}

# -------------------------------------------------- ministro.json

$jsonMinistro = [ordered]@{}

$bdPessoa = Read-MsAccessData .\bd\Mesce.accdb "SELECT * FROM bd2json_ministro_pessoa"

ForEach ($pessoa In $bdPessoa) {
    $ministro = [ordered]@{
        "nome" = $pessoa.nome
        "nomeGuerra" = $pessoa.nomeGuerra
        "aniversario" = $pessoa.aniversario
        "comMandato" = $true
    }
    $jsonMinistro.($pessoa.id) = $ministro
}

$bdFuncao = Read-MsAccessData .\bd\Mesce.accdb "SELECT * FROM bd2json_ministro_funcao"

ForEach ($funcao In $bdFuncao) {
    $jsonMinistro."$($funcao.id)".funcao = $funcao.funcao
}

$bdFuncao = Read-MsAccessData .\bd\Mesce.accdb "SELECT * FROM bd2json_ministro_funcao"

ForEach ($funcao In $bdFuncao) {
    $jsonMinistro."$($funcao.id)".funcao = $funcao.funcao
}

$bdDisponibilidade = Read-MsAccessData .\bd\Mesce.accdb "SELECT * FROM bd2json_ministro_disponibilidade"

ForEach ($disponibilidade In $bdDisponibilidade) {
    If (-not ($jsonMinistro."$($disponibilidade.id)".disponibilidade)) {
        $jsonMinistro."$($disponibilidade.id)".disponibilidade = @()
    }
    $jsonMinistro."$($disponibilidade.id)".disponibilidade += $disponibilidade.disponibilidade
}

$bdAfastamento = Read-MsAccessData .\bd\Mesce.accdb "SELECT * FROM bd2json_ministro_afastamento"

ForEach ($afastamento In $bdAfastamento) {
    If (-not ($jsonMinistro."$($afastamento.id)".afastamento)) {
        $jsonMinistro."$($afastamento.id)".afastamento = @()
    }
    $a = [ordered]@{
        "motivo" = $afastamento.motivo
        "inicio" = $afastamento.inicio
    }
    If ($afastamento.fim.GetType().Name -ne "DBNull") {
        $a.fim = $afastamento.fim
    }
    $jsonMinistro."$($afastamento.id)".afastamento += $a
}

$jsonMinistro | ConvertTo-Json -Depth 3 | Out-File .\data\ministro.json
