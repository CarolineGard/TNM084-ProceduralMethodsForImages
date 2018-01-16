
var mountainFragment = `
	#ifdef GL_ES
	precision highp float;
	#endif

	// **************** SIMPLEX NOISE *********************
	//
	// Description : Array and textureless GLSL 2D/3D/4D simplex noise functions.
	//      Author : Ian McEwan, Ashima Arts.
	//  Maintainer : stegu
	//     Lastmod : 20110822 (ijm)
	//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
	//               Distributed under the MIT License. See LICENSE file.
	//               https://github.com/ashima/webgl-noise
	//               https://github.com/stegu/webgl-noise
	// 
	vec3 mod289(vec3 x) {
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 mod289(vec4 x) {
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 permute(vec4 x) {
	     return mod289(((x*34.0)+1.0)*x);
	}

	vec4 taylorInvSqrt(vec4 r)
	{
	  return 1.79284291400159 - 0.85373472095314 * r;
	}

	/////////////////////////////
	float snoise(vec3 v)
	{ 
	  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
	  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

	  // First corner
	  vec3 i  = floor(v + dot(v, C.yyy) );
	  vec3 x0 =   v - i + dot(i, C.xxx) ;

	  // Other corners
	  vec3 g = step(x0.yzx, x0.xyz);
	  vec3 l = 1.0 - g;
	  vec3 i1 = min( g.xyz, l.zxy );
	  vec3 i2 = max( g.xyz, l.zxy );

	  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
	  //   x1 = x0 - i1  + 1.0 * C.xxx;
	  //   x2 = x0 - i2  + 2.0 * C.xxx;
	  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
	  vec3 x1 = x0 - i1 + C.xxx;
	  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
	  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

	  // Permutations
	  i = mod289(i); 
	  vec4 p = permute( permute( permute( 
	             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
	           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
	           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients: 7x7 points over a square, mapped onto an octahedron.
	  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
	  float n_ = 0.142857142857; // 1.0/7.0
	  vec3  ns = n_ * D.wyz - D.xzx;

	  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

	  vec4 x_ = floor(j * ns.z);
	  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

	  vec4 x = x_ *ns.x + ns.yyyy;
	  vec4 y = y_ *ns.x + ns.yyyy;
	  vec4 h = 1.0 - abs(x) - abs(y);

	  vec4 b0 = vec4( x.xy, y.xy );
	  vec4 b1 = vec4( x.zw, y.zw );

	  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
	  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
	  vec4 s0 = floor(b0)*2.0 + 1.0;
	  vec4 s1 = floor(b1)*2.0 + 1.0;
	  vec4 sh = -step(h, vec4(0.0));

	  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
	  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

	  vec3 p0 = vec3(a0.xy,h.x);
	  vec3 p1 = vec3(a0.zw,h.y);
	  vec3 p2 = vec3(a1.xy,h.z);
	  vec3 p3 = vec3(a1.zw,h.w);

	  //Normalise gradients
	  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
	  p0 *= norm.x;
	  p1 *= norm.y;
	  p2 *= norm.z;
	  p3 *= norm.w;

	  // Mix final noise value
	  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
	  m = m * m;
	  
	  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
	}

	uniform float uAltitude;
	uniform vec3 uLightPosition;
	uniform vec3 uLightPositionSun;
	uniform vec3 uLightPositionMoon;
	
	varying vec3 vUv;
	varying float vHeight;

	varying vec3 vPosition;
	varying vec3 vNormal;
	varying vec3 vViewPosition;

	//Fragment Mountain
	void main()
	{
		float noise1 = snoise( vec3(vPosition.x * 0.07, vPosition.y * 0.07, 1.0));
		noise1 *= snoise( vec3(vPosition.x * 0.005, vPosition.y * 0.005, 1.0));

		vec3 clrSeaBottom = vec3( 0.1 );
		vec3 clrGround    = vec3( 0.11, 0.51, 0.3 );
		vec3 clrBlueClose = vec3( 0.01, 0.13, 0.19 ); //darker
		vec3 clrBlueFar   = vec3( 0.03, 0.31, 0.47 ); //lighter
		vec3 clrGrass     = vec3( 0.0, 0.6, 0.46 );
		vec3 clrSnow      = vec3( 1.0 );
		vec3 clrSnow1     = vec3( 0.7 );

		//Interpolation
		float noiseSnow = 20.0 * snoise( vec3( 50.0 * vPosition.x, 1.0 * vPosition.y, vPosition.z ) );
		float noiseSnow2 = snoise( vec3( 0.0005 * vPosition ) );
		noiseSnow *= 10.0 * snoise( 0.0001 * vPosition );
		
		float bottomGround = smoothstep( -400.0, -220.0, vHeight );
		float grassGround  = smoothstep( -180.0, -124.0, vHeight );
		float stoneGround  = smoothstep( -300.0, -60.0, vHeight );
		float snowGround   = smoothstep( 40.0, 150.0, vHeight + noiseSnow );
		float depthGround  = smoothstep( -100.0, 1000.0, vPosition.y );
		
		//mix colors
		vec3 clrDepth = mix( clrBlueClose, clrBlueFar, depthGround );
		vec3 clrSnowMix = mix( clrSnow, clrSnow1, noiseSnow2 );

		vec3 clrMix = clrSeaBottom; 
		clrMix = mix( clrMix, clrGround, bottomGround );
		clrMix = mix( clrMix, clrGrass, grassGround );
		clrMix = mix( clrMix, clrDepth, stoneGround );
		clrMix = mix( clrMix, clrSnow, snowGround );


		//Light Calculations

		//New normal for current point, after added noise
		//dFdx, dFdy returns the partial derivative 
		//calculate normal using screen-space derivatives for flat shading, polygon style
		vec3 newNormal = normalize( cross( dFdx( vViewPosition ), dFdy( vViewPosition ) ) );

		vec3 lightDirection     = normalize( ( uLightPosition     - vPosition) );
		vec3 lightDirectionSun  = normalize( ( uLightPositionSun  - vPosition ) );
		vec3 lightDirectionMoon = normalize( ( uLightPositionMoon - vPosition ) );
		
		//float lightIntensity = 0.35 + max( 0.0, dot( newNormal, lightDirection * 0.8 ));
		float lightIntensity     = 0.8 * dot( lightDirection, newNormal ) ;
		float lightIntensitySun  = 1.5 * dot( lightDirectionSun, newNormal );
		float lightIntensityMoon = 1.5 * dot( lightDirectionMoon, newNormal );

		//Don't add light if sun or moon is down 
		if (lightIntensitySun < 0.0 )
			lightIntensitySun = 0.0;

		if (lightIntensityMoon < 0.0 )
			lightIntensityMoon = 0.0;

		lightIntensity *= 0.9 * lightIntensitySun * lightIntensityMoon;
		lightIntensity += 0.5; 

		float lightAmbient = 1.0;

		gl_FragColor = vec4( clrMix * lightIntensity * lightAmbient, 1.0 );
	}
`;