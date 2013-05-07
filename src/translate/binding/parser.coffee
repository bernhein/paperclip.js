Tokenizer  = require "./tokenizer"
TokenCodes = Tokenizer.codes 
BaseParser = require "../base/parser"

FnExpression         = require "./expressions/fn"
JsExpression         = require "./expressions/js"
RefExpression        = require "./expressions/ref"
GroupExpression      = require "./expressions/group"
ParamsExpression     = require "./expressions/params"
StringExpression     = require "./expressions/string"
ScriptExpression     = require "./expressions/script"
OptionExpression     = require "./expressions/option"
ScriptsExpression    = require "./expressions/scripts"
OptionsExpression    = require "./expressions/options"
RefPathExpression    = require "./expressions/refPath"
ModifierExpression   = require "./expressions/modifier"
CollectionExpression = require "../base/collectionExpression"

###
 action: 
###

class Parser extends BaseParser

  ###
  ###

  constructor: () ->
    super new Tokenizer()


  ###
  ###

  _parse: () ->
    @_nextCode()
    @_parseActionsOrOptions()

  ###
  ###

  _parseActionsOrOptions: () ->
    actions = []

    # not a colon? actions aren't provided
    if not (pn = @_t.peekNext()) or pn[0] isnt TokenCodes.COLON
      return new ScriptExpression undefined, @_parseActionOptions()


    while @_t.current
      actions.push @_parseAction()
      if @_currentCode() is TokenCodes.SEMI_COLON
        @_nextCode()
    
    new ScriptsExpression actions

  ###
  ###

  _parseAction: () ->
    name = @_currentString()
    @_expectNextCode TokenCodes.COLON
    @_nextCode()
    new ScriptExpression name, @_parseActionOptions()

  ###
  ###

  _parseActionOptions: () ->  
    switch @_currentCode() 
      when TokenCodes.LB then @_parseMultiOptions()
      else @_parseReference()

  ###
  ###

  _parseMultiOptions: () ->
    c = @_currentCode()
    options = []




    while c and (c = @_currentCode()) isnt TokenCodes.RB
    
      @_nextCode()

      name = @_currentString()

      @_expectNextCode TokenCodes.COLON

      @_nextCode()
      options.push new OptionExpression name, @_parseActionOptions()

    # get rid of RP
    @_nextCode()

    new OptionsExpression options

  ###
  ###

  _parseReference: () ->

    # references to watch
    expressions   = []
    modifiers     = []


    while c = @_currentCode()

      if c is TokenCodes.VAR
        expressions.push @_parseRef()
        c = @_currentCode()

      if c is TokenCodes.LP
        expressions.push @_parseGroup()
        c = @_currentCode()

      if c is TokenCodes.LB
        expressions.push @_parseActionOptions()
        c = @_currentCode()

      if c is TokenCodes.STRING
        expressions.push new StringExpression @_currentString()
        c = @_nextCode()

      while c is TokenCodes.PIPE
        @_nextCode()
        expressions.push @_parsePipe expressions.pop()
        c = @_currentCode()


      # end of multi statement
      if ~[TokenCodes.RP, TokenCodes.RB].indexOf c
        break

      if not c or ~[TokenCodes.SEMI_COLON, TokenCodes.COMA].indexOf c
        break

      expressions.push new JsExpression @_currentString()

      @_nextCode()


    # semi colon? skip it
    if @_currentCode() is TokenCodes.SEMI_COLON
      @_nextCode()

    new CollectionExpression(expressions)

  ###
   filter item.name > 5, test;
  ###

  _parsePipe: (expressions) ->
    name = @_currentString()
    params = []
    @_nextCode()
    new ModifierExpression name, @_parseParams(), expressions

  ###
  ###

  _parseParams: () ->
    new ParamsExpression @_parseParams2()

  ###
  ###

  _parseParams2: () ->
    @_expectCurrentCode TokenCodes.LP
    params = []
    while c = @_nextCode()
      break if c is TokenCodes.RP

      params.push @_parseReference()
      c = @_currentCode()

      break if c isnt TokenCodes.COMA

    @_nextCode()

    params

  ###
  ###

  _parseGroup: () -> new GroupExpression @_parseParams2()

  ###
  ###

  _parseRef: () ->
    c = @_currentCode()
    refs = []
    assign = null
    

    while c is TokenCodes.VAR
      name = @_currentString()

      # function all
      if (c = @_nextCode()) is TokenCodes.LP
        refs.push new FnExpression name, @_parseParams()
        c = @_currentCode()
      else
        refs.push new RefExpression name

      if c is TokenCodes.DOT 
        c = @_nextCode()


    if c is TokenCodes.AS
      @_nextCode()
      castAs = @_currentString()
      @_nextCode()


    if c is TokenCodes.ASSIGN
      @_nextCode()
      assign = @_parseReference()


    new RefPathExpression refs, castAs, assign

module.exports = new Parser()
