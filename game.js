var shapesAsTriangles = require('./out/triangulatedShapes.json').triangulatedShapes
var b2 = require('box2dweb')
var b2DebugDraw = b2.Dynamics.b2DebugDraw
var b2World = b2.Dynamics.b2World
var b2PolygonShape = b2.Collision.Shapes.b2PolygonShape
var b2Body = b2.Dynamics.b2Body
var b2BodyDef = b2.Dynamics.b2BodyDef
var b2Fixture = b2.Dynamics.b2Fixture
var b2FixtureDef = b2.Dynamics.b2FixtureDef
var v = b2.Common.Math.b2Vec2

// World with downward gravity
var world = new b2World( new v(0, 10), 'sleep allowed' )

var fixDef = new b2FixtureDef()
fixDef.density = 1
fixDef.friction = 0.5
fixDef.restitution = 0.2
var bodyDef = new b2BodyDef()

var scale = function (coordinate) { return coordinate / 300 }

//
// Static bodies (ground and walls)
//
bodyDef.type = b2Body.b2_staticBody
fixDef.shape = new b2PolygonShape()
fixDef.shape.SetAsBox(20, 2)
bodyDef.position.Set(10, 400 / 30 + 1.8)
world.CreateBody(bodyDef).CreateFixture(fixDef)
bodyDef.position.Set(10, -1.8)
world.CreateBody(bodyDef).CreateFixture(fixDef)
fixDef.shape.SetAsBox(2, 14)
bodyDef.position.Set(-1.8, 13)
world.CreateBody(bodyDef).CreateFixture(fixDef)
bodyDef.position.Set(21.8, 13)
world.CreateBody(bodyDef).CreateFixture(fixDef)

var maxY = 300 / 30

//
// Dynamic bodies (the drawn shapes)
//
bodyDef.type = b2Body.b2_dynamicBody
// Create a new body for each shape (array of triangles).
shapesAsTriangles.forEach(function (triangleList) {
  bodyDef.position = new v(0, 0)
  var body = world.CreateBody(bodyDef)

  // Create a new fixture for each triangle belonging to this shape, and add it
  // to the body.
  triangleList.forEach(function (trianglePoints) {

    // The triangle's points come in clockwise order, but Box2D expects them
    // counterclockwise.
    trianglePoints.reverse()

    fixDef.shape = new b2PolygonShape()
    fixDef.shape.SetAsArray(trianglePoints.map(function (p) {
      return new v(
          scale(p.x),
          maxY - scale(p.y)
        )
    }))
    body.CreateFixture(fixDef)
  })
})

var debugDraw = new b2DebugDraw()
debugDraw.SetSprite(document.getElementById('game').getContext('2d'))
debugDraw.SetDrawScale(30.0)
debugDraw.SetFillAlpha(0.5)
debugDraw.SetLineThickness(1.0)
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)

world.SetDebugDraw(debugDraw)

var update = function () {
  world.Step(1 / 60, 10, 10)
  world.DrawDebugData()
  world.ClearForces()
}

window.setInterval(update, 1000 / 60)
