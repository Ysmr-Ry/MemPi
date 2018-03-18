var cvs, ctx, cntr;
var ang = 0, p = 0, r = 200, alpha = 1.0, theta = 0.0, toTheta = 0.0, fl = false, sfl = false, infoX = 160, infoY = 100, end = false;

window.onload = function() {
  cvs = document.getElementById('canvas');
  ctx = cvs.getContext('2d');
  cntr = document.getElementById('container');
  
  sizing();

  function sizing() {
    cvs.height = cntr.offsetHeight;
    cvs.width = cntr.offsetWidth;
  }

  window.addEventListener('resize', function() {
    (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);
  });

  render();
};

document.onkeyup = event => {
  let keyEvent = event || window.event;
  let code = keyEvent.keyCode;

  if( !end && !fl && code >= 48 && code <= 57 )
  {
    if( pi[p] == code-48 )
      ++p;
    else
      end = true;
  }
  if( end )
  {
    if( code == 84 )
    {
      var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent("MemPi Score: "+p+" digits\n#MemPi #円周率チャレンジ");
      window.open( url, '_blank' );
    }
    else if( code == 32 )
    {
      p = 0;
      r = 200;
      alpha = 1.0;
      theta = toTheta = 0.0;
      fl = sfl = end = false;
      infoX = 160;
      infoY = 100;
    }
  }
}

function drawDigit( num, ang, x, y )
{
  ctx.save();
  ctx.translate( x, y );
  ctx.rotate( ang );
  
  ctx.textAlign = "center";
  ctx.fillText( num, 0, 0 );

  ctx.restore();
}

function morph( f, t, d )
{ return f+(t-f)/d; }

function render()
{
  var w = cntr.offsetWidth, h = cntr.offsetHeight;
  ctx.clearRect( 0, 0, w, h );

  ctx.fillStyle = "rgb(40,40,40)";
  ctx.font = "normal 80px 'Yu Gothic'";
  ctx.textAlign = "center";

  let mod = fl?10:p%10;

  ctx.fillText( p+" digits", infoX, infoY );

  ctx.fillStyle = "rgba(40,40,40,"+alpha+")";
  ctx.font = "normal 100px 'Yu Gothic'";

  if( !end )
  {
    for( let i = 0; i < mod; ++i )
    {
      let phi = 2*Math.PI/10*i;

      drawDigit( pi[p-mod+i], phi-theta, w/2+Math.cos( phi-theta-Math.PI/2 )*r, h/2+Math.sin( phi-theta-Math.PI/2 )*r );
    }

    if( !sfl && p != 0 && p % 10 == 0 )
      fl = true;

    if( fl && Math.abs( theta-2*Math.PI/10*9 ) < 0.01 )
    {
      r = morph( r, 400, 10 );
      alpha = morph( alpha, 0.0, 10 );
    }
    
    if( p % 10 )
      sfl = false;

    if( Math.abs( r - 400 ) < 10 )
    {
      r = 200;
      alpha = 1.0;
      theta = toTheta = 0;
      fl = false;
      sfl = true;
    }

    mod = fl?10:p%10;

    toTheta = 2*Math.PI/10*(mod-1);
    theta = morph( theta, toTheta, 4 );
  }
  else
  {
    infoX = morph( infoX, w/2, 10 );
    infoY = morph( infoY, h/2-40, 10 );

    ctx.font = "normal 40px 'Yu Gothic'";
    ctx.fillText( "Press T to Tweet Score", infoX, infoY+90 );
    ctx.fillText( "Press Space to Restart", infoX, infoY+140 );
  }

  requestAnimationFrame( render );
}
