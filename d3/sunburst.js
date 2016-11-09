function sunburst(data) {
	
	var first = true;
	
	//console.log(data);

	var width = 800,
	    height = 1000,
	    radius = Math.min(width, height) / 2,
	    color = d3.scale.category20c();
	    
	$("#graph").append('<form><input type="radio" id="size" name="mode" value="size" checked> <label for="size">Size</label><input type="radio" id="count" name="mode" value="count"> <label for="count">Count</label></form>');

	var svg = d3.select("#graph").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height * .52 + ")");

	var partition = d3.layout.partition().sort(null).size([2 * Math.PI, radius * radius]).value(function(d) {
		return 1;
	});

	var arc = d3.svg.arc().startAngle(function(d) {
		return d.x;
	}).endAngle(function(d) {
		return d.x + d.dx;
	}).innerRadius(function(d) {
		return Math.sqrt(d.y);
	}).outerRadius(function(d) {
		return Math.sqrt(d.y + d.dy);
	});
	
	data = JSON.parse(data);
	
	burst(data);

	//d3.json("./TestdataD3/testSunburst.json", function(error, root) {
	function burst(root) {	
		/*if (error)
			throw error;*/
			
		//console.log(root);

		var path = svg.datum(root).selectAll("path").data(partition.nodes).enter().append("path").attr("display", function(d) {
			return d.depth ? null : "none";
		})// hide inner ring
		.attr("d", arc).style("stroke", "#fff").style("fill", function(d) {
			return ("rgb("+d.color+")");
			//return color((d.children ? d : d.parent).name);
		}).style("fill-rule", "evenodd").each(stash);
		
		if (first && $("#size").is(":checked")) {
			var value = function(d) {
				return d.size;
			};		

			path.data(partition.value(value).nodes).transition().duration(1500).attrTween("d", arcTween);
			first = false;
		}

		d3.selectAll("input").on("change", function change() {
			var value = this.value === "count" ? function() {
				return 1;
			} : function(d) {
				return d.size;
			};

			path.data(partition.value(value).nodes).transition().duration(1500).attrTween("d", arcTween);
		});
	}
	//});

	// Stash the old values for transition.
	function stash(d) {
		d.x0 = d.x;
		d.dx0 = d.dx;
	}

	// Interpolate the arcs in data space.
	function arcTween(a) {
		var i = d3.interpolate({
			x : a.x0,
			dx : a.dx0
		}, a);
		return function(t) {
			var b = i(t);
			a.x0 = b.x;
			a.dx0 = b.dx;
			return arc(b);
		};
	}


	d3.select(self.frameElement).style("height", height + "px");
}