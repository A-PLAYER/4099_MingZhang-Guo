#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

//console
float cubes = 5.0;
int yuv = 2;
mat3 rgb;

//yuv color
mat3 yuv2rgb2 = mat3(sin(3.328*u_time)+3.0, -0.360, 2.004,
                    cos(2.528*u_time), sin(-5.128*u_time)+3.0, -0.413,
                    sin(u_time*3.0), 1.864, 0.160);

mat3 yuv2rgb = mat3(2.0+3.0, -0.360, 2.004,
                    2.528, -5.128+3.0, -0.413,
                    1.0, 1.864, -0.776);

//bricks
vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    if(yuv == 2){
           _st.x += step(1., mod(_st.y,2.0)) * (u_time);
   		   _st.x += step(1., mod(_st.x,2.0)) * (u_time);
    }


    return fract(_st);
}

//box
float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

//circle
float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*sin(u_time)),
                         _radius+(_radius*-1.038),
                         dot(dist,dist)*0.568);
}

//matrix
float plot(vec2 _st, float _radius){
        vec2 dist = _st-vec2(sin(u_time),tan(u_time));
  return  smoothstep(_radius-(_radius*sin(u_time)),
                         _radius+(_radius*-1.022),
                         dot(dist,dist)*2.048);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);
    
    //brick pattern
	st = brickTile(st,cubes);
	color = vec3(box(st,vec2(sin(u_time*2.0)-cos(u_time))));
    //move
    gl_FragColor = vec4(color,1.0);
    
    //circle
    float y = smoothstep(cos(u_time*0.1),sin(u_time*0.9),st.x);
    vec3 color2 = vec3(y);
    float pct = plot(st,y);
    color2 = (tan(0.944-pct))*color2+vec3(sin(u_time),1.0,0.5);
    gl_FragColor = vec4(sin(color2),1.0);
    
    //matrix
    if(yuv >0){
        st -= sin(1.568*u_time);
        st *= 2.0;
        if(yuv == 1){
            rgb = yuv2rgb;
        } else if (yuv == 2){
            rgb = yuv2rgb2;
        }
        color = rgb * vec3(0.5, st.x, st.y);
    }

    gl_FragColor = vec4(color,1.0);
    }