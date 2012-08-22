R = Raphael

define ->
  (initialMatrix)->
    currentMatrix = initialMatrix || R.matrix()
    stack = [currentMatrix]

    clone = ->
      transformStack( currentMatrix.clone() )


    push = ->
      stack.push( currentMatrix )
      currentMatrix = currentMatrix.clone()
      @

    pop = ->
      stack.pop()
      currentMatrix = _.last( stack )
      @

    desc = -> 
      currentMatrix.toTransformString()

    descAndPop = -> 
      str = desc()
      pop()
      str

    prefixedWithTranslate = (x,y)->
      prefix = R.matrix()
      prefix.translate(x,y)
      prefix.add( currentMatrix )
      prefix


    chainerFor = ( methodName )->
      (args...)->
        currentMatrix[methodName](args...)
        @

    translate = chainerFor('translate')
    rotate = chainerFor('rotate')

    skew = (x,y)->
      x = R.rad(x)
      y = R.rad(y)
      currentMatrix.add( 1, 0, Math.tan(x), 1, 0, 0 )
      currentMatrix.add( 1, Math.tan(y), 0, 1, 0, 0 )
      @


    clone: clone
    translate: translate
    rotate: rotate
    skew: skew
    push: push
    pop: pop
    desc: desc
    descAndPop: descAndPop
    prefixedWithTranslate: prefixedWithTranslate


