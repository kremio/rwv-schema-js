/*{
  "uri":"https://muenchen-chronik.de/8-mai-2018-der-dritte-weg-propagandaktion/",
  "title":"Der Dritte Weg – Propagandaaktion",
  "description":"Zum Tag der Befreiung vom Nationalsozialismus in Deutschland versammelt sich eine Handvoll Akteur_innen des „Dritten Wegs“ unangemeldet am Kriegerdenkmal im Hofgarten und am Trümmerfrauen-Denkmal am Marstallplatz. An beiden Orten posieren zwei Personen mit Fahnen der Neonazi-Partei für Fotos, von denen schließlich einige in einem Online-Artikel auf der „Dritter Weg“-Website veröffentlicht werden. Eines der hochgeladenen Bilder zeigt den „Dritter Weg-Stützpunktleiter München/Oberbayern“ Karl-Heinz Statzberger (Oberschleißheim) und weitere Aktivist*innen, wie sie Kerzen mit dem Logo der neonazistischen Organisation am Denkmal hinterlassen. Auf einem anderen Foto ist zu sehen, wie ein Neonazi am Trümmerfrauen-Denkmal offenbar eine ausgedruckte Rede abliest.",
  "startDate":"2018-05-07T22:00:00.000Z",
  "iso3166_2":"DE-BY",
  "locations":[{"subdivisions":["Muenchen","BA 01 Altstadt – Lehel"]}],
  "sources":[{"name":"Schlagworte: Der Dritte Weg","publishedDate":null,"url":null}],
  "motives":["Verherrlichung NS-Regime"],"contexts":["Kundgebung/Mahnwache","Öffentlicher Raum allgemein"],
  "factums":["Propagandaaktion"],
  "tags":null
}*/

const validate = require('../index.js')

const requiredProperties = ["uri","description","startDate","iso3166_2","locations","sources"]

function findError( errorArray, predicate ){
  return errorArray.find( predicate )
}

describe('Validata JSON against schema', () => {

  test( 'Empty object', (done) => {
    try{
      validate({})
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      requiredProperties.forEach( (prop) => expect( findError(e, (err) => {
        return err.keyword == 'required' && err.params.missingProperty == prop
      }) ).toBeTruthy() )
      done()
    }
  })

  test( 'Null required properties', (done) => {
    const nullObj = requiredProperties.reduce( (acc, prop) => Object.assign(acc, {[prop]: null} ), {} )
    try{
      validate( nullObj )
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      requiredProperties.forEach( (prop) => expect( findError(e, (err) => {
        return err.keyword == 'type' && err.dataPath == '.'+prop
      }) ).toBeTruthy() )
      done()
    }
  })


  test( 'Invalid URI', (done) => {

    try{
      validate({
        "uri":"not a URI"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.keyword == 'format' && err.dataPath == '.uri' ) ).toBeTruthy()
      done()
    }
  })

  test( 'Valid URI', (done) => {
    try{
      validate({
        "uri":"protocol://root/path/ressource"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.dataPath == '.uri' ) ).toBeUndefined()
      done()
    }
  })

  test( 'Description present', (done) => {
    try{
      validate({
        "description":"Some text"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.dataPath == '.description') ).toBeUndefined()
      done()
    }
  })

  test( 'Invalid startDate', (done) => {
    try{
      validate({
        "startDate":"10th of January 1987"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.keyword == 'format' && err.dataPath == '.startDate') ).toBeTruthy()
      done()
    }
  })

  test( 'Valid startDate', (done) => {
    try{
      validate({
        "startDate":"1987-01-10T00:00:00Z"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.dataPath == '.startDate') ).toBeUndefined()
      done()
    }
  })

  test( 'Invalid iso3166_2', (done) => {
    try{
      validate({
        "iso3166_2":"de-BA"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.keyword == 'pattern' && err.dataPath == '.iso3166_2') ).toBeTruthy()
      done()
    }
  })

  test( 'Valid iso3166_2', (done) => {
    try{
      validate({
        "iso3166_2":"DE-BA"
      })
      done.fail(new Error('Validation should have failed'))
    }catch(e){
      expect( findError(e, (err) => err.dataPath == '.iso3166_2') ).toBeUndefined()
      done()
    }
  })

  describe( 'Locations property', () => {

    test( 'At least one Location', (done) => {
      try{
        validate({
          "locations":[]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => err.keyword == 'minItems' && err.dataPath == '.locations') ).toBeTruthy()
        done()
      }
    })


    test( 'No subdivision', (done) => {
      try{
        validate({
          "locations":[{
          }]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => {
          return err.keyword == 'required' && err.dataPath == '.locations[0]' && err.params.missingProperty == 'subdivisions'
        }) ).toBeTruthy()
        done()
      }
    })

    test( 'At least one subdivision', (done) => {
      try{
        validate({
          "locations":[{
            "subdivisions":[]
          }]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => err.keyword == 'minItems' && err.dataPath == '.locations[0].subdivisions' ) ).toBeTruthy()
        done()
      }
    })

    test( 'Null subdivision', (done) => {
      try{
        validate({
          "locations":[{
            "subdivisions":[null]
          }]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => err.keyword == 'type' && err.dataPath == '.locations[0].subdivisions[0]' ) ).toBeTruthy()
        done()
      }
    })

    test( 'Valid location', (done) => {
      try{
        validate({
          "locations":[{
            "subdivisions":["Bärlin"]
          }]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => /locations/.test(err.dataPath) ) ).toBeUndefined()
        done()
      }
    })
  })

  test( 'Minimal valid object', () => {
    expect( validate({
      "uri":"protocol://some/ressource",
      "description":"A description",
      "startDate": (new Date()).toISOString(),
      "iso3166_2":"DE-BE",
      "locations":[{
        "subdivisions":["Berlin","Moabit"]
      }],
      "sources":[{
        "name":"Jonathan Crémieux"
      }]
    })).toBeTruthy()
  })

  describe( 'Sources property', () => {

    test( 'At least one source', (done) => {
      try{
        validate({
          "sources":[]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => err.keyword == 'minItems' && err.dataPath == '.sources') ).toBeTruthy()
        done()
      }
    })

    test( 'Name required', (done) => {
      try{
        validate({
          "sources":[{}]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => err.keyword == 'required' && err.dataPath == '.sources[0]' && err.params.missingProperty == 'name' ) ).toBeTruthy()
        done()
      }
    })

    test( 'Null name', (done) => {
      try{
        validate({
          "sources":[{
            "name":null
          }]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => err.keyword == 'type' && err.dataPath == '.sources[0].name' ) ).toBeTruthy()
        done()
      }
    })

    test( 'Valid source', (done) => {
      try{
        validate({
          "sources":[{
            "name": "Deep Throat"
          }]
        })
        done.fail(new Error('Validation should have failed'))
      }catch(e){
        expect( findError(e, (err) => /sources/.test(err.dataPath) ) ).toBeUndefined()
        done()
      }
    })

  })

})
