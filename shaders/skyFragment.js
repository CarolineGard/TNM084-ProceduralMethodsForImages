var skyFragment = `
	// **************** SIMPLEX NOISE *********************
	//
	// GLSL textureless classic 4D noise "cnoise",
	// with an RSL-style periodic variant "pnoise".
	// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
	// Version: 2011-08-22
	//
	// Many thanks to Ian McEwan of Ashima Arts for the
	// ideas for permutation and gradient selection.
	//
	// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
	// Distributed under the MIT license. See LICENSE file.
	// https://github.com/stegu/webgl-noise
	//

	vec4 mod289(vec4 x)
	{
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec4 permute(vec4 x)
	{
	  return mod289(((x*34.0)+1.0)*x);
	}

	vec4 taylorInvSqrt(vec4 r)
	{
	  return 1.79284291400159 - 0.85373472095314 * r;
	}

	vec4 fade(vec4 t) {
	  return t*t*t*(t*(t*6.0-15.0)+10.0);
	}

	// Classic Perlin noise
	float cnoise(vec4 P)
	{
	  vec4 Pi0 = floor(P); // Integer part for indexing
	  vec4 Pi1 = Pi0 + 1.0; // Integer part + 1
	  Pi0 = mod289(Pi0);
	  Pi1 = mod289(Pi1);
	  vec4 Pf0 = fract(P); // Fractional part for interpolation
	  vec4 Pf1 = Pf0 - 1.0; // Fractional part - 1.0
	  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
	  vec4 iy = vec4(Pi0.yy, Pi1.yy);
	  vec4 iz0 = vec4(Pi0.zzzz);
	  vec4 iz1 = vec4(Pi1.zzzz);
	  vec4 iw0 = vec4(Pi0.wwww);
	  vec4 iw1 = vec4(Pi1.wwww);

	  vec4 ixy = permute(permute(ix) + iy);
	  vec4 ixy0 = permute(ixy + iz0);
	  vec4 ixy1 = permute(ixy + iz1);
	  vec4 ixy00 = permute(ixy0 + iw0);
	  vec4 ixy01 = permute(ixy0 + iw1);
	  vec4 ixy10 = permute(ixy1 + iw0);
	  vec4 ixy11 = permute(ixy1 + iw1);

	  vec4 gx00 = ixy00 * (1.0 / 7.0);
	  vec4 gy00 = floor(gx00) * (1.0 / 7.0);
	  vec4 gz00 = floor(gy00) * (1.0 / 6.0);
	  gx00 = fract(gx00) - 0.5;
	  gy00 = fract(gy00) - 0.5;
	  gz00 = fract(gz00) - 0.5;
	  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
	  vec4 sw00 = step(gw00, vec4(0.0));
	  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
	  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

	  vec4 gx01 = ixy01 * (1.0 / 7.0);
	  vec4 gy01 = floor(gx01) * (1.0 / 7.0);
	  vec4 gz01 = floor(gy01) * (1.0 / 6.0);
	  gx01 = fract(gx01) - 0.5;
	  gy01 = fract(gy01) - 0.5;
	  gz01 = fract(gz01) - 0.5;
	  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
	  vec4 sw01 = step(gw01, vec4(0.0));
	  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
	  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

	  vec4 gx10 = ixy10 * (1.0 / 7.0);
	  vec4 gy10 = floor(gx10) * (1.0 / 7.0);
	  vec4 gz10 = floor(gy10) * (1.0 / 6.0);
	  gx10 = fract(gx10) - 0.5;
	  gy10 = fract(gy10) - 0.5;
	  gz10 = fract(gz10) - 0.5;
	  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
	  vec4 sw10 = step(gw10, vec4(0.0));
	  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
	  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

	  vec4 gx11 = ixy11 * (1.0 / 7.0);
	  vec4 gy11 = floor(gx11) * (1.0 / 7.0);
	  vec4 gz11 = floor(gy11) * (1.0 / 6.0);
	  gx11 = fract(gx11) - 0.5;
	  gy11 = fract(gy11) - 0.5;
	  gz11 = fract(gz11) - 0.5;
	  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
	  vec4 sw11 = step(gw11, vec4(0.0));
	  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
	  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

	  vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
	  vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
	  vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
	  vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
	  vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
	  vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
	  vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
	  vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
	  vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
	  vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
	  vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
	  vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
	  vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
	  vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
	  vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
	  vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

	  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
	  g0000 *= norm00.x;
	  g0100 *= norm00.y;
	  g1000 *= norm00.z;
	  g1100 *= norm00.w;

	  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
	  g0001 *= norm01.x;
	  g0101 *= norm01.y;
	  g1001 *= norm01.z;
	  g1101 *= norm01.w;

	  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
	  g0010 *= norm10.x;
	  g0110 *= norm10.y;
	  g1010 *= norm10.z;
	  g1110 *= norm10.w;

	  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
	  g0011 *= norm11.x;
	  g0111 *= norm11.y;
	  g1011 *= norm11.z;
	  g1111 *= norm11.w;

	  float n0000 = dot(g0000, Pf0);
	  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
	  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
	  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
	  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
	  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
	  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
	  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
	  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
	  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
	  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
	  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
	  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
	  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
	  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
	  float n1111 = dot(g1111, Pf1);

	  vec4 fade_xyzw = fade(Pf0);
	  vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
	  vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
	  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
	  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
	  float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
	  return 2.2 * n_xyzw;
	}

	// Cellular noise ("Worley noise") in 2D in GLSL.
	// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.
	// This code is released under the conditions of the MIT license.
	// See LICENSE file for details.
	// https://github.com/stegu/webgl-noise

	// Modulo 289 without a division (only multiplications)

	vec3 mod289(vec3 x) {
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	vec2 mod289(vec2 x) {
	  return x - floor(x * (1.0 / 289.0)) * 289.0;
	}

	// Modulo 7 without a division
	vec3 mod7(vec3 x) {
	  return x - floor(x * (1.0 / 7.0)) * 7.0;
	}

	// Permutation polynomial: (34x^2 + x) mod 289
	vec3 permute(vec3 x) {
	  return mod289((34.0 * x + 1.0) * x);
	}

	// Cellular noise, returning F1 and F2 in a vec2.
	// Standard 3x3 search window for good F1 and F2 values
	vec2 cellular(vec2 P) {
	#define K 0.142857142857 // 1/7
	#define Ko 0.428571428571 // 3/7
	#define jitter 1.0 // Less gives more regular pattern
		vec2 Pi = mod289(floor(P));
	 	vec2 Pf = fract(P);
		vec3 oi = vec3(-1.0, 0.0, 1.0);
		vec3 of = vec3(-0.5, 0.5, 1.5);
		vec3 px = permute(Pi.x + oi);
		vec3 p = permute(px.x + Pi.y + oi); // p11, p12, p13
		vec3 ox = fract(p*K) - Ko;
		vec3 oy = mod7(floor(p*K))*K - Ko;
		vec3 dx = Pf.x + 0.5 + jitter*ox;
		vec3 dy = Pf.y - of + jitter*oy;
		vec3 d1 = dx * dx + dy * dy; // d11, d12 and d13, squared
		p = permute(px.y + Pi.y + oi); // p21, p22, p23
		ox = fract(p*K) - Ko;
		oy = mod7(floor(p*K))*K - Ko;
		dx = Pf.x - 0.5 + jitter*ox;
		dy = Pf.y - of + jitter*oy;
		vec3 d2 = dx * dx + dy * dy; // d21, d22 and d23, squared
		p = permute(px.z + Pi.y + oi); // p31, p32, p33
		ox = fract(p*K) - Ko;
		oy = mod7(floor(p*K))*K - Ko;
		dx = Pf.x - 1.5 + jitter*ox;
		dy = Pf.y - of + jitter*oy;
		vec3 d3 = dx * dx + dy * dy; // d31, d32 and d33, squared
		// Sort out the two smallest distances (F1, F2)
		vec3 d1a = min(d1, d2);
		d2 = max(d1, d2); // Swap to keep candidates for F2
		d2 = min(d2, d3); // neither F1 nor F2 are now in d3
		d1 = min(d1a, d2); // F1 is now in d1
		d2 = max(d1a, d2); // Swap to keep candidates for F2
		d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; // Swap if smaller
		d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; // F1 is in d1.x
		d1.yz = min(d1.yz, d2.yz); // F2 is now not in d2.yz
		d1.y = min(d1.y, d1.z); // nor in  d1.z
		d1.y = min(d1.y, d2.x); // F2 is in d1.y, we're done.
		return sqrt(d1.xy);
	}


	uniform float uTime;
	uniform float uSpeed;

	varying vec3 vPosition;

	//Fragment Sky
	void main() {

		//Star Texture 
		vec2 pos2D = vec2( vPosition.x, vPosition.y );
		
		vec2 starNoise = 15.0 * cellular( 0.005 * pos2D );
		starNoise += 0.6 * cnoise( 0.005 * vec4( vPosition, 1.0 ) );

		vec2 starNoise2 = 12.0 * cellular( 0.008 * pos2D );
		starNoise2 += 0.5 * cnoise( 0.004 * vec4( vPosition, 1.0 ) );
		
		
		//Daytime 
		vec3 clrBlueDark = vec3( 0.55, 0.82, 0.9 );
		vec3 clrBlueLight = vec3( 0.85, 0.93, 0.94 );

		//Sunset
		vec3 clrYellow = vec3( 0.99, 0.85, 0.61 );
		vec3 clrGreenYellow = vec3( 0.74, 0.95, 0.87 );

		//Night
		vec3 clrGreenDark = 0.8 * vec3( 0.26, 0.55, 0.53 );
		vec3 clrGreenLight = 0.8 * vec3( 0.2, 0.63, 0.47 );
		vec3 clrGreenLight2 = vec3( 0.74, 0.95, 0.87 );
		vec3 clrStar = vec3( 1.0 );

		float noise = 0.0;

		float theTime = cos( uTime * uSpeed );
		float distCenter = sqrt( pow( vPosition.x, 2.0 ) * 0.8 + pow( vPosition.y + 100.0, 2.0 ) );

		float gradDay = smoothstep( 200.0, 1000.0, vPosition.y );
		float gradSunset = smoothstep( 0.0, 1000.0, vPosition.y );
		float simple = 0.0;

		// Sky day
		vec3 clrMixDay = mix( clrBlueLight, clrBlueDark, gradDay );
		// Sky Sunset and Sunrise
		vec3 clrMixSunset = mix( clrYellow, clrGreenYellow, gradSunset );
		//Sky night
		float starNoise1 = clamp( ( 1.0 - starNoise.x), 0.0, 0.7 ) + 
						   clamp( ( 1.0 - starNoise2.x), 0.0, 0.1 );
			
		vec3 clrMixNight = mix( clrGreenLight, clrGreenDark, gradSunset );

		vec3 clrMix1 = mix( clrMixNight, clrStar, starNoise1 );
		vec3 clrMixNightFinal = mix( clrMix1, clrStar, simple );


		// INTERPOLATION DEPENDING ON TIME OF THE DAY
		float timeCos = cos( uSpeed * uTime );
		float timeSin = sin( uSpeed * uTime );

		vec3 clrFinal = vec3( 0.0 );
		
		if( timeCos > 0.0 && timeSin > 0.0  ) //Day to sunset
			clrFinal = mix( clrMixSunset, clrMixDay, abs( timeCos ) );
		
		
		if( timeCos < 0.0 && timeSin > 0.0  ) //Sunset to night
			clrFinal = mix( clrMixSunset, clrMixNightFinal, abs( timeCos ) );
		
		
		if( timeCos < 0.0 && timeSin < 0.0  ) //Night to sunset
			clrFinal = mix( clrMixSunset, clrMixNightFinal, abs( timeCos ) );

		if( timeCos > 0.0 && timeSin < 0.0  ) //Sunset to day
			clrFinal = mix( clrMixSunset, clrMixDay, abs( timeCos ) );

		gl_FragColor = vec4( clrFinal, 1.0);

	}
`;