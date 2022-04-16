const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
sparks = []

class Spark
{
    constructor(loc, angle, speed, color, scale=1)
    {
        this.loc=loc
        this.angle=angle
        this.speed=speed
        this.scale=scale
        this.color=color
        this.alive=true
    }
    point_towards(angle, rate)
    {
        rotate_direction = ((angle - this.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        if(rotate_direction!=0)
        {
            rotate_sign = Math.abs(rotate_direction) / rotate_direction
        }
        if(Math.abs(rotate_direction) < rate)
        {
            this.angle=angle;
        }
        else
        {
            this.angle += rate * rotate_sign
        }
    }

    calculate_movement(dt)
    {
        return [Math.cos(this.angle) * this.speed * dt, Math.sin(this.angle) * this.speed * dt]
    }

    // # gravity and friction
    velocity_adjust(friction, force, terminal_velocity, dt)
    {
        var movement = this.calculate_movement(dt)
        movement[1] = min(terminal_velocity, movement[1] + force * dt)
        movement[0] *= friction
        this.angle = Math.atan2(movement[1], movement[0])
    }
    //     # if you want to get more realistic, the speed should be adjusted here

    move(dt)
    {
        var movement = this.calculate_movement(dt)
        this.loc[0] += movement[0]
        this.loc[1] += movement[1]
        this.speed -= 0.1

        if(this.speed <= 0)
        {
            this.alive=false;
        }
    }

    //     # a bunch of options to mess around with relating to angles...
    //     #this.point_towards(Math.PI / 2, 0.02)
    //     #this.velocity_adjust(0.975, 0.2, 8, dt)
    //     #this.angle += 0.1


    draw(offset=[0, 0])
    {
        var points=[]
        if(this.alive)
        {
            var points = [
                [this.loc[0] + Math.cos(this.angle) * this.speed * this.scale, this.loc[1] + Math.sin(this.angle) * this.speed * this.scale],
                [this.loc[0] + Math.cos(this.angle + Math.PI / 2) * this.speed * this.scale * 0.3, this.loc[1] + Math.sin(this.angle + Math.PI / 2) * this.speed * this.scale * 0.3],
                [this.loc[0] - Math.cos(this.angle) * this.speed * this.scale * 3.5, this.loc[1] - Math.sin(this.angle) * this.speed * this.scale * 3.5],
                [this.loc[0] + Math.cos(this.angle - Math.PI / 2) * this.speed * this.scale * 0.3, this.loc[1] - Math.sin(this.angle + Math.PI / 2) * this.speed * this.scale * 0.3],
                ]
                ctx.fillStyle=this.color
                ctx.beginPath()
                ctx.moveTo(points[0][0],points[0][1])
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i][0],points[i][1])
                }
                ctx.closePath();
                ctx.stroke();
        }
    }
}
class Sparker
{
    constructor(POSX,POSY)
    {
        this.sparks=[]
        this.POSX=POSX
        this.POSY=POSY
    }
    draw2()
    {
        var POSX=this.POSX
        var POSY=this.POSY
        this.sparks.push(new Spark([POSX,POSY],Math.random()*2*Math.PI,Math.random()*2+2,"#000",1))
        this.sparks.sort()
        this.sparks.reverse()
        // console.log(POSX,POSY);
        for (let i = 0; i < this.sparks.length; i++) {
            this.sparks[i].move(1)
            this.sparks[i].draw()
            if (!this.sparks[i].alive)
            {
                // sparks.pop(i)
                // sparks.push(new Spark([POSX,POSY],Math.random()*2*Math.PI,Math.random()*3+3,"#000",1))
            }
        }
        if(this.sparks.length>10)
        {
            this.sparks=this.sparks.slice(5,)
        }
}
}
// for (let i = 0; i < 50;i++) {
//     sparks.push(new Spark([POSX,POSY],Math.random()*2*Math.PI,Math.random()*3+3,"#000",2))
// }
sparks=new Sparker(100,100)
sparks2=new Sparker(500,500)
function animate()
{
    ctx.clearRect(0,0,canvas.width,canvas.height)
    requestAnimationFrame(animate);
    sparks.draw2()
    sparks2.draw2()
}
// canvas.addEventListener("mousemove", function (e) {
//     var a = getMousePosition(canvas, e);
      
// });
// function getMousePosition(canvas, event) {
//     let rect = canvas.getBoundingClientRect();
//     POSX = event.clientX - rect.left;
//     POSY = event.clientY - rect.top;
// }
animate()