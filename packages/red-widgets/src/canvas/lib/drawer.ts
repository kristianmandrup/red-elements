import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasDrawer extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * Reveal Canvas item by id
   * @param id
   */
  reveal(id) {
    if (this.RED.nodes.workspace(id) || this.RED.nodes.subflow(id)) {
      this.RED.workspaces.show(id);
    } else {
      var node = this.RED.nodes.node(id);
      if (node._def.category !== 'config' && node.z) {
        node.highlighted = true;
        node.dirty = true;
        this.RED.workspaces.show(node.z);

        var screenSize = [$('#chart').width(), $('#chart').height()];
        var scrollPos = [$('#chart').scrollLeft(), $('#chart').scrollTop()];

        if (node.x < scrollPos[0] || node.y < scrollPos[1] || node.x > screenSize[0] + scrollPos[0] || node.y > screenSize[1] + scrollPos[1]) {
          var deltaX = '-=' + ((scrollPos[0] - node.x) + screenSize[0] / 2);
          var deltaY = '-=' + ((scrollPos[1] - node.y) + screenSize[1] / 2);
          $('#chart').animate({
            scrollLeft: deltaX,
            scrollTop: deltaY
          }, 200);
        }

        if (!node._flashing) {
          node._flashing = true;
          var flash = 22;
          var flashFunc = function () {
            flash--;
            node.dirty = true;
            if (flash >= 0) {
              node.highlighted = !node.highlighted;
              setTimeout(flashFunc, 100);
            } else {
              node.highlighted = false;
              delete node._flashing;
            }
            this.RED.view.redraw();
          }
          flashFunc();
        }
      } else if (node._def.category === 'config') {
        this.RED.sidebar.config.show(id);
      }
    }
  }

  /**
   * (Re)draw canvas
   * @param updateActive
   */
  redraw(updateActive?: boolean) {
    const { canvas } = this
    const {
      updateActiveNodes,
      updateSelection,
      vis,
      outer,
      mouse_mode,
      scaleFactor,
      space_width,
      space_height,
      activeSubflow,
      activeNodes,
      activeLinks,
      activeFlowLinks,
  } = canvas

    let {
      startTouchCenter,
      startTouchDistance
    } = canvas

    const {
      nodeMouseUp,
      nodeMouseDown,
      touchLongPressTimeout
    } = this.rebind([
        'nodeMouseUp',
        'nodeMouseDown',
        'touchLongPressTimeout'
      ], canvas)

    let {
      touchStartTime
    } = this.rebind([
        'touchStartTime',
      ], this.canvas)

    if (updateActive) {
      updateActiveNodes();
      updateSelection();
    }

    if (!vis) {
      this.handleError('redraw: vis not yet defined', {
        vis,
        view: this
      })
    }

    vis.attr('transform', 'scale(' + scaleFactor + ')');

    if (!outer) {
      this.handleError('redraw: outer not yet defined', {
        outer,
        view: this
      })
    }

    outer
      .attr('width', space_width * scaleFactor)
      .attr('height', space_height * scaleFactor);

    // Don't bother redrawing nodes if we're drawing links
    if (mouse_mode != this.RED.state.JOINING) {

      var dirtyNodes = {};

      if (activeSubflow) {
        var subflowOutputs = vis.selectAll('.subflowoutput').data(activeSubflow.out, (d, i) => {
          return d.id;
        });
        subflowOutputs.exit().remove();
        var outGroup = subflowOutputs.enter().insert('svg:g').attr('class', 'node subflowoutput').attr('transform', (d) => {
          return 'translate(' + (d.x - 20) + ',' + (d.y - 20) + ')'
        });
        outGroup.each(function (d, i) {
          d.w = 40;
          d.h = 40;
        });
        outGroup.append('rect').attr('class', 'subflowport').attr('rx', 8).attr('ry', 8).attr('width', 40).attr('height', 40)
          // TODO: This is exactly the same set of handlers used for regular nodes - DRY
          .on('mouseup', nodeMouseUp)
          .on('mousedown', nodeMouseDown)
          .on('touchstart', (d) => {
            // TODO: fixed?
            const svgElem = vis
            var obj = d3.select(svgElem);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            startTouchCenter = [touch0.pageX, touch0.pageY];
            startTouchDistance = 0;
            touchStartTime = setTimeout(function () {
              this.showTouchMenu(obj, pos);
            }, touchLongPressTimeout);
            nodeMouseDown.call(this, d)
          })
          .on('touchend', (d) => {
            clearTimeout(touchStartTime);
            touchStartTime = null;
            if (this.RED.touch.radialMenu.active()) {
              d3.event.stopPropagation();
              return;
            }
            this.nodeMouseUp.call(this, d);
          });

        outGroup.append('g').attr('transform', 'translate(-5,15)').append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
          .on('mousedown', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_INPUT, 0);
          })
          .on('touchstart', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_INPUT, 0);
          })
          .on('mouseup', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_INPUT, 0);
          })
          .on('touchend', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_INPUT, 0);
          })
          .on('mouseover', function (d) {
            this.portMouseOver(d3.select(this), d, PORT_TYPE_INPUT, 0);
          })
          .on('mouseout', function (d) {
            this.portMouseOut(d3.select(this), d, PORT_TYPE_INPUT, 0);
          });

        outGroup.append('svg:text').attr('class', 'port_label').attr('x', 20).attr('y', 8).style('font-size', '10px').text('output');
        outGroup.append('svg:text').attr('class', 'port_label port_index').attr('x', 20).attr('y', 24).text(function (d, i) {
          return i + 1
        });

        var subflowInputs = vis.selectAll('.subflowinput').data(activeSubflow.in, function (d, i) {
          return d.id;
        });
        subflowInputs.exit().remove();
        var inGroup = subflowInputs.enter().insert('svg:g').attr('class', 'node subflowinput').attr('transform', function (d) {
          return 'translate(' + (d.x - 20) + ',' + (d.y - 20) + ')'
        });
        inGroup.each(function (d, i) {
          d.w = 40;
          d.h = 40;
        });
        inGroup.append('rect').attr('class', 'subflowport').attr('rx', 8).attr('ry', 8).attr('width', 40).attr('height', 40)
          // TODO: This is exactly the same set of handlers used for regular nodes - DRY
          .on('mouseup', this.nodeMouseUp)
          .on('mousedown', this.nodeMouseDown)
          .on('touchstart', function (d) {
            var obj = d3.select(this);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.startTouchCenter = [touch0.pageX, touch0.pageY];
            this.startTouchDistance = 0;
            this.touchStartTime = setTimeout(function () {
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
            this.nodeMouseDown.call(this, d)
          })
          .on('touchend', function (d) {
            clearTimeout(this.touchStartTime);
            this.touchStartTime = null;
            if (this.RED.touch.radialMenu.active()) {
              d3.event.stopPropagation();
              return;
            }
            this.nodeMouseUp.call(this, d);
          });

        inGroup.append('g').attr('transform', 'translate(35,15)').append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
          .on('mousedown', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_OUTPUT, i);
          })
          .on('touchstart', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_OUTPUT, i);
          })
          .on('mouseup', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_OUTPUT, i);
          })
          .on('touchend', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_OUTPUT, i);
          })
          .on('mouseover', function (d) {
            this.portMouseOver(d3.select(this), d, PORT_TYPE_OUTPUT, 0);
          })
          .on('mouseout', function (d) {
            this.portMouseOut(d3.select(this), d, PORT_TYPE_OUTPUT, 0);
          });


        inGroup.append('svg:text').attr('class', 'port_label').attr('x', 18).attr('y', 20).style('font-size', '10px').text('input');



        subflowOutputs.each(function (d: any, i) {
          if (d.dirty) {
            var output = d3.select(this);
            output.selectAll('.subflowport').classed('node_selected', function (d: any) {
              return d.selected;
            })
            output.selectAll('.port_index').text(function (d: any) {
              return d.i + 1
            });
            output.attr('transform', function (d: any) {
              return 'translate(' + (d.x - d.w / 2) + ',' + (d.y - d.h / 2) + ')';
            });
            dirtyNodes[d.id] = d;
            d.dirty = false;
          }
        });
        subflowInputs.each(function (d: any, i) {
          if (d.dirty) {
            var input = d3.select(this);
            input.selectAll('.subflowport').classed('node_selected', function (d: any) {
              return d.selected;
            })
            input.attr('transform', function (d: any) {
              return 'translate(' + (d.x - d.w / 2) + ',' + (d.y - d.h / 2) + ')';
            });
            dirtyNodes[d.id] = d;
            d.dirty = false;
          }
        });
      } else {
        vis.selectAll('.subflowoutput').remove();
        vis.selectAll('.subflowinput').remove();
      }

      var node = vis.selectAll('.nodegroup').data(activeNodes, function (d) {
        return d.id
      });
      node.exit().remove();

      var nodeEnter = node.enter().insert('svg:g')
        .attr('class', 'node nodegroup')
        .classed('node_subflow', function (d) {
          return activeSubflow != null;
        })
        .classed('node_link', function (d) {
          return d.type === 'link in' || d.type === 'link out'
        });

      nodeEnter.each(function (d, i) {
        var node = d3.select(this);
        var isLink = d.type === 'link in' || d.type === 'link out';
        node.attr('id', d.id);
        var l = this.RED.utils.getNodeLabel(d);
        if (isLink) {
          d.w = this.node_height;
        } else {
          d.w = Math.max(this.node_width, 20 * (Math.ceil((this.calculateTextWidth(l, 'node_label', 50) + (d._def.inputs > 0 ? 7 : 0)) / 20)));
        }
        d.h = Math.max(this.node_height, (d.outputs || 0) * 15);

        if (d._def.badge) {
          var badge = node.append('svg:g').attr('class', 'node_badge_group');
          var badgeRect = badge.append('rect').attr('class', 'node_badge').attr('rx', 5).attr('ry', 5).attr('width', 40).attr('height', 15);
          badge.append('svg:text').attr('class', 'node_badge_label').attr('x', 35).attr('y', 11).attr('text-anchor', 'end').text(d._def.badge());
          if (d._def.onbadgeclick) {
            badgeRect.attr('cursor', 'pointer')
              .on('click', function (d: any) {
                d._def.onbadgeclick.call(d);
                d3.event.preventDefault();
              });
          }
        }

        if (d._def.button) {
          var nodeButtonGroup = node.append('svg:g')
            .attr('transform', function (d: any) {
              return 'translate(' + ((d._def.align == 'right') ? 94 : -25) + ',2)';
            })
            .attr('class', function (d: any) {
              return 'node_button ' + ((d._def.align == 'right') ? 'node_right_button' : 'node_left_button');
            });
          nodeButtonGroup.append('rect')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', 32)
            .attr('height', this.node_height - 4)
            .attr('fill', '#eee'); //function(d) { return d._def.color;})
          nodeButtonGroup.append('rect')
            .attr('class', 'node_button_button')
            .attr('x', function (d: any) {
              return d._def.align == 'right' ? 11 : 5
            })
            .attr('y', 4)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('width', 16)
            .attr('height', this.node_height - 12)
            .attr('fill', function (d: any) {
              return d._def.color;
            })
            .attr('cursor', 'pointer')
            .on('mousedown', (d) => {
              if (!this.lasso && this.isButtonEnabled(d)) {
                this.focusView();
                d3.select(this).attr('fill-opacity', 0.2);
                d3.event.preventDefault();
                d3.event.stopPropagation();
              }
            })
            .on('mouseup', (d) => {
              if (!this.lasso && this.isButtonEnabled(d)) {
                d3.select(this).attr('fill-opacity', 0.4);
                d3.event.preventDefault();
                d3.event.stopPropagation();
              }
            })
            .on('mouseover', (d) => {
              if (!this.lasso && this.isButtonEnabled(d)) {
                d3.select(this).attr('fill-opacity', 0.4);
              }
            })
            .on('mouseout', (d: any) => {
              if (!this.lasso && this.isButtonEnabled(d)) {
                var op = 1;
                if (d._def.button.toggle) {
                  op = d[d._def.button.toggle] ? 1 : 0.2;
                }
                d3.select(this).attr('fill-opacity', op);
              }
            })
            .on('click', this.nodeButtonClicked)
            .on('touchstart', this.nodeButtonClicked)
        }

        var mainRect = node.append('rect')
          .attr('class', 'node')
          .classed('node_unknown', function (d: any) {
            return d.type == 'unknown';
          })
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('fill', function (d: any) {
            return d._def.color;
          })
          .on('mouseup', this.nodeMouseUp)
          .on('mousedown', this.nodeMouseDown)
          .on('touchstart', (d: any) => {
            var obj = d3.select(this);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.startTouchCenter = [touch0.pageX, touch0.pageY];
            this.startTouchDistance = 0;
            this.touchStartTime = setTimeout(function () {
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
            this.nodeMouseDown.call(this, d)
          })
          .on('touchend', (d: any) => {
            clearTimeout(this.touchStartTime);
            this.touchStartTime = null;
            if (this.RED.touch.radialMenu.active()) {
              d3.event.stopPropagation();
              return;
            }
            this.nodeMouseUp.call(this, d);
          })
          .on('mouseover', function (d) {
            if (mouse_mode === 0) {
              var node = d3.select(this);
              node.classed('node_hovered', true);
            }
          })
          .on('mouseout', function (d) {
            var node = d3.select(this);
            node.classed('node_hovered', false);
          });

        //node.append('rect').attr('class', 'node-gradient-top').attr('rx', 6).attr('ry', 6).attr('height',30).attr('stroke','none').attr('fill','url(#gradient-top)').style('pointer-events','none');
        //node.append('rect').attr('class', 'node-gradient-bottom').attr('rx', 6).attr('ry', 6).attr('height',30).attr('stroke','none').attr('fill','url(#gradient-bottom)').style('pointer-events','none');

        if (d._def.icon) {
          var icon_url = this.RED.utils.getNodeIcon(d._def, d);
          var icon_group = node.append('g')
            .attr('class', 'node_icon_group')
            .attr('x', 0).attr('y', 0);

          var icon_shade = icon_group.append('rect')
            .attr('x', 0).attr('y', 0)
            .attr('class', 'node_icon_shade')
            .attr('width', '30')
            .attr('stroke', 'none')
            .attr('fill', '#000')
            .attr('fill-opacity', '0.05')
            .attr('height', function (d: any) {
              return Math.min(50, d.h - 4);
            });

          var icon = icon_group.append('image')
            .attr('xlink:href', icon_url)
            .attr('class', 'node_icon')
            .attr('x', 0)
            .attr('width', '30')
            .attr('height', '30');

          var icon_shade_border = icon_group.append('path')
            .attr('d', function (d: any) {
              return 'M 30 1 l 0 ' + (d.h - 2)
            })
            .attr('class', 'node_icon_shade_border')
            .attr('stroke-opacity', '0.1')
            .attr('stroke', '#000')
            .attr('stroke-width', '1');

          if ('right' == d._def.align) {
            icon_group.attr('class', 'node_icon_group node_icon_group_' + d._def.align);
            icon_shade_border.attr('d', function (d: any) {
              return 'M 0 1 l 0 ' + (d.h - 2)
            })
            //icon.attr('class','node_icon node_icon_'+d._def.align);
            //icon.attr('class','node_icon_shade node_icon_shade_'+d._def.align);
            //icon.attr('class','node_icon_shade_border node_icon_shade_border_'+d._def.align);
          }

          //if (d.inputs > 0 && d._def.align == null) {
          //    icon_shade.attr('width',35);
          //    icon.attr('transform','translate(5,0)');
          //    icon_shade_border.attr('transform','translate(5,0)');
          //}
          //if (d._def.outputs > 0 && 'right' == d._def.align) {
          //    icon_shade.attr('width',35); //icon.attr('x',5);
          //}

          var img = new Image();
          img.src = icon_url;
          img.onload = function () {
            icon.attr('width', Math.min(img.width, 30));
            icon.attr('height', Math.min(img.height, 30));
            icon.attr('x', 15 - Math.min(img.width, 30) / 2);
            //if ('right' == d._def.align) {
            //    icon.attr('x',function(d){return d.w-img.width-1-(d.outputs>0?5:0);});
            //    icon_shade.attr('x',function(d){return d.w-30});
            //    icon_shade_border.attr('d',function(d){return 'M '+(d.w-30)+' 1 l 0 '+(d.h-2);});
            //}
          }

          //icon.style('pointer-events','none');
          icon_group.style('pointer-events', 'none');
        }
        if (!isLink) {
          var text = node.append('svg:text').attr('class', 'node_label').attr('x', 38).attr('dy', '.35em').attr('text-anchor', 'start');
          if (d._def.align) {
            text.attr('class', 'node_label node_label_' + d._def.align);
            if (d._def.align === 'right') {
              text.attr('text-anchor', 'end');
            }
          }

          var status = node.append('svg:g').attr('class', 'node_status_group').style('display', 'none');

          var statusRect = status.append('rect').attr('class', 'node_status')
            .attr('x', 6).attr('y', 1).attr('width', 9).attr('height', 9)
            .attr('rx', 2).attr('ry', 2).attr('stroke-width', '3');

          var statusLabel = status.append('svg:text')
            .attr('class', 'node_status_label')
            .attr('x', 20).attr('y', 9);
        }
        //node.append('circle').attr({'class':'centerDot','cx':0,'cy':0,'r':5});

        //node.append('path').attr('class','node_error').attr('d','M 3,-3 l 10,0 l -5,-8 z');

        //TODO: these ought to be SVG
        node.append('image').attr('class', 'node_error hidden').attr('xlink:href', 'icons/node-red/node-error.png').attr('x', 0).attr('y', -6).attr('width', 10).attr('height', 9);
        node.append('image').attr('class', 'node_changed hidden').attr('xlink:href', 'icons/node-red/node-changed.png').attr('x', 12).attr('y', -6).attr('width', 10).attr('height', 10);
      });

      node.each(function (d, i) {
        if (d.dirty) {
          var isLink = d.type === 'link in' || d.type === 'link out';
          dirtyNodes[d.id] = d;
          //if (d.x < -50) deleteSelection();  // Delete nodes if dragged back to palette
          if (!isLink && d.resize) {
            var l = this.RED.utils.getNodeLabel(d);
            var ow = d.w;
            d.w = Math.max(this.node_width, 20 * (Math.ceil((this.calculateTextWidth(l, 'node_label', 50) + (d._def.inputs > 0 ? 7 : 0)) / 20)));
            d.h = Math.max(this.node_height, (d.outputs || 0) * 15);
            d.x += (d.w - ow) / 2;
            d.resize = false;
          }
          var thisNode = d3.select(this);
          //thisNode.selectAll('.centerDot').attr({'cx':function(d) { return d.w/2;},'cy':function(d){return d.h/2}});
          thisNode.attr('transform', function (d: any) {
            return 'translate(' + (d.x - d.w / 2) + ',' + (d.y - d.h / 2) + ')';
          });

          if (mouse_mode != this.RED.state.MOVING_ACTIVE) {
            thisNode.selectAll('.node')
              .attr('width', function (d: any) {
                return d.w
              })
              .attr('height', function (d: any) {
                return d.h
              })
              .classed('node_selected', function (d: any) {
                return d.selected;
              })
              .classed('node_highlighted', function (d: any) {
                return d.highlighted;
              });
            //thisNode.selectAll('.node-gradient-top').attr('width',function(d){return d.w});
            //thisNode.selectAll('.node-gradient-bottom').attr('width',function(d){return d.w}).attr('y',function(d){return d.h-30});

            thisNode.selectAll('.node_icon_group_right').attr('transform', function (d: any) {
              return 'translate(' + (d.w - 30) + ',0)'
            });
            thisNode.selectAll('.node_label_right').attr('x', function (d: any) {
              return d.w - 38
            });
            //thisNode.selectAll('.node_icon_right').attr('x',function(d){return d.w-d3.select(this).attr('width')-1-(d.outputs>0?5:0);});
            //thisNode.selectAll('.node_icon_shade_right').attr('x',function(d){return d.w-30;});
            //thisNode.selectAll('.node_icon_shade_border_right').attr('d',function(d){return 'M '+(d.w-30)+' 1 l 0 '+(d.h-2)});

            var inputPorts = thisNode.selectAll('.port_input');
            if (d.inputs === 0 && !inputPorts.empty()) {
              inputPorts.remove();
              //nodeLabel.attr('x',30);
            } else if (d.inputs === 1 && inputPorts.empty()) {
              var inputGroup = thisNode.append('g').attr('class', 'port_input');
              inputGroup.append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
                .on('mousedown', (d) => {
                  this.portMouseDown(d, PORT_TYPE_INPUT, 0);
                })
                .on('touchstart', (d) => {
                  this.portMouseDown(d, PORT_TYPE_INPUT, 0);
                })
                .on('mouseup', (d) => {
                  this.portMouseUp(d, PORT_TYPE_INPUT, 0);
                })
                .on('touchend', (d) => {
                  this.portMouseUp(d, PORT_TYPE_INPUT, 0);
                })
                .on('mouseover', (d) => {
                  this.portMouseOver(d3.select(this), d, PORT_TYPE_INPUT, 0);
                })
                .on('mouseout', (d) => {
                  this.portMouseOut(d3.select(this), d, PORT_TYPE_INPUT, 0);
                });
            }

            var numOutputs = d.outputs;
            var y = (d.h / 2) - ((numOutputs - 1) / 2) * 13;
            d.ports = d.ports || d3.range(numOutputs);
            d._ports = thisNode.selectAll('.port_output').data(d.ports);
            var output_group = d._ports.enter().append('g').attr('class', 'port_output');

            output_group.append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
              .on('mousedown', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseDown(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('touchstart', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseDown(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('mouseup', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseUp(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('touchend', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseUp(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('mouseover', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseOver(d3.select(this), node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('mouseout', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseOut(d3.select(this), node, PORT_TYPE_OUTPUT, i);
                }
              })());

            d._ports.exit().remove();
            if (d._ports) {
              numOutputs = d.outputs || 1;
              y = (d.h / 2) - ((numOutputs - 1) / 2) * 13;
              var x = d.w - 5;
              d._ports.each(function (d, i) {
                var port = d3.select(this);
                //port.attr('y',(y+13*i)-5).attr('x',x);
                port.attr('transform', function (d) {
                  return 'translate(' + x + ',' + ((y + 13 * i) - 5) + ')';
                });
              });
            }
            thisNode.selectAll('text.node_label').text((d: any, i) => {
              var l: any = '';
              if (d._def.label) {
                l = d._def.label;
                try {
                  l = (typeof l === 'function' ? l.call(d) : l) || '';
                  l = this.RED.text.bidi.enforceTextDirectionWithUCC(l);
                } catch (err) {
                  console.log('Definition error: ' + d.type + '.label', err);
                  l = d.type;
                }
              }
              return l;
            })
              .attr('y', function (d: any) {
                return (d.h / 2) - 1;
              })
              .attr('class', function (d: any) {
                var s: any = '';
                if (d._def.labelStyle) {
                  s = d._def.labelStyle;
                  try {
                    s = (typeof s === 'function' ? s.call(d) : s) || '';
                  } catch (err) {
                    console.log('Definition error: ' + d.type + '.labelStyle', err);
                    s = '';
                  }
                  s = ' ' + s;
                }
                return 'node_label' +
                  (d._def.align ? ' node_label_' + d._def.align : '') + s;
              });

            if (d._def.icon) {
              this.icon = thisNode.select('.node_icon');
              var current_url = this.icon.attr('xlink:href');
              var new_url = this.RED.utils.getNodeIcon(d._def, d);
              if (new_url !== current_url) {
                this.icon.attr('xlink:href', new_url);
                var img = new Image();
                img.src = new_url;
                img.onload = () => {
                  this.icon.attr('width', Math.min(img.width, 30));
                  this.icon.attr('height', Math.min(img.height, 30));
                  this.icon.attr('x', 15 - Math.min(img.width, 30) / 2);
                }
              }
            }


            thisNode.selectAll('.node_tools').attr('x', function (d: any) {
              return d.w - 35;
            }).attr('y', function (d: any) {
              return d.h - 20;
            });

            thisNode.selectAll('.node_changed')
              .attr('x', function (d: any) {
                return d.w - 10
              })
              .classed('hidden', function (d: any) {
                return !(d.changed || d.moved);
              });

            thisNode.selectAll('.node_error')
              .attr('x', function (d: any) {
                return d.w - 10 - ((d.changed || d.moved) ? 13 : 0)
              })
              .classed('hidden', function (d: any) {
                return d.valid;
              });

            thisNode.selectAll('.port_input').each(function (d, i) {
              var port = d3.select(this);
              port.attr('transform', function (d: any) {
                return 'translate(-5,' + ((d.h / 2) - 5) + ')';
              })
            });

            thisNode.selectAll('.node_icon').attr('y', function (d: any) {
              const height: number = parseInt(d3.select(this).attr('height'))
              return (d.h - height) / 2;
            });
            thisNode.selectAll('.node_icon_shade').attr('height', function (d: any) {
              return d.h;
            });
            thisNode.selectAll('.node_icon_shade_border').attr('d', function (d: any) {
              return 'M ' + (('right' == d._def.align) ? 0 : 30) + ' 1 l 0 ' + (d.h - 2)
            });

            thisNode.selectAll('.node_button').attr('opacity', (d) => {
              return (activeSubflow || !this.isButtonEnabled(d)) ? 0.4 : 1
            });
            thisNode.selectAll('.node_button_button').attr('cursor', (d) => {
              return (activeSubflow || !this.isButtonEnabled(d)) ? '' : 'pointer';
            });
            thisNode.selectAll('.node_right_button').attr('transform', function (d: any) {
              var x = d.w - 6;
              if (d._def.button.toggle && !d[d._def.button.toggle]) {
                x = x - 8;
              }
              return 'translate(' + x + ',2)';
            });
            thisNode.selectAll('.node_right_button rect').attr('fill-opacity', function (d: any) {
              if (d._def.button.toggle) {
                return d[d._def.button.toggle] ? 1 : 0.2;
              }
              return 1;
            });

            //thisNode.selectAll('.node_right_button').attr('transform',function(d){return 'translate('+(d.w - d._def.button.width.call(d))+','+0+')';}).attr('fill',function(d) {
            //         return typeof d._def.button.color  === 'function' ? d._def.button.color.call(d):(d._def.button.color != null ? d._def.button.color : d._def.color)
            //});

            thisNode.selectAll('.node_badge_group').attr('transform', function (d: any) {
              return 'translate(' + (d.w - 40) + ',' + (d.h + 3) + ')';
            });
            thisNode.selectAll('text.node_badge_label').text(function (d: any, i) {
              if (d._def.badge) {
                if (typeof d._def.badge == 'function') {
                  try {
                    return d._def.badge.call(d);
                  } catch (err) {
                    console.log('Definition error: ' + d.type + '.badge', err);
                    return '';
                  }
                } else {
                  return d._def.badge;
                }
              }
              return '';
            });
          }

          if (!this.showStatus || !d.status) {
            thisNode.selectAll('.node_status_group').style('display', 'none');
          } else {
            thisNode.selectAll('.node_status_group').style('display', 'inline').attr('transform', 'translate(3,' + (d.h + 3) + ')');
            var fill = this.status_colours[d.status.fill]; // Only allow our colours for now
            if (d.status.shape == null && fill == null) {
              thisNode.selectAll('.node_status').style('display', 'none');
            } else {
              var style;
              if (d.status.shape == null || d.status.shape == 'dot') {
                style = {
                  display: 'inline',
                  fill: fill,
                  stroke: fill
                };
              } else if (d.status.shape == 'ring') {
                style = {
                  display: 'inline',
                  fill: '#fff',
                  stroke: fill
                }
              }
              thisNode.selectAll('.node_status').style(style);
            }
            if (d.status.text) {
              thisNode.selectAll('.node_status_label').text(d.status.text);
            } else {
              thisNode.selectAll('.node_status_label').text('');
            }
          }

          d.dirty = false;
        }
      });

      var link = vis.selectAll('.link').data(
        activeLinks,
        function (d) {
          return d.source.id + ':' + d.sourcePort + ':' + d.target.id + ':' + d.target.i;
        }
      );
      var linkEnter = link.enter().insert('g', '.node').attr('class', 'link');

      linkEnter.each((d, i) => {
        // TODO: Fixed?
        const svgElem = this.vis
        var l = d3.select(svgElem);
        d.added = true;
        l.append('svg:path').attr('class', 'link_background link_path')
          .on('mousedown', (d) => {
            this.mousedown_link = d;
            this.clearSelection();
            this.selected_link = this.mousedown_link;
            this.updateSelection();
            this.redraw();
            this.focusView();
            d3.event.stopPropagation();
          })
          .on('touchstart', (d) => {
            this.mousedown_link = d;
            this.clearSelection();
            this.selected_link = this.mousedown_link;
            this.updateSelection();
            this.redraw();
            this.focusView();
            d3.event.stopPropagation();

            var obj = d3.select(document.body);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.touchStartTime = setTimeout(() => {
              this.touchStartTime = null;
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
          })
        l.append('svg:path').attr('class', 'link_outline link_path');
        l.append('svg:path').attr('class', 'link_line link_path')
          .classed('link_link', function (d: any) {
            return d.link
          })
          .classed('link_subflow', function (d: any) {
            return !d.link && activeSubflow
          });
      });

      link.exit().remove();
      var links = vis.selectAll('.link_path');
      links.each(function (d) {
        var link = d3.select(this);
        if (d.added || d === this.selected_link || d.selected || dirtyNodes[d.source.id] || dirtyNodes[d.target.id]) {
          link.attr('d', function (d: any) {
            var numOutputs = d.source.outputs || 1;
            var sourcePort = d.sourcePort || 0;
            var y = -((numOutputs - 1) / 2) * 13 + 13 * sourcePort;

            var dy = d.target.y - (d.source.y + y);
            var dx = (d.target.x - d.target.w / 2) - (d.source.x + d.source.w / 2);
            var delta = Math.sqrt(dy * dy + dx * dx);
            var scale = this.lineCurveScale;
            var scaleY = 0;
            if (delta < this.node_width) {
              scale = 0.75 - 0.75 * ((this.node_width - delta) / this.node_width);
            }

            if (dx < 0) {
              scale += 2 * (Math.min(5 * this.node_width, Math.abs(dx)) / (5 * this.node_width));
              if (Math.abs(dy) < 3 * this.node_height) {
                scaleY = ((dy > 0) ? 0.5 : -0.5) * (((3 * this.node_height) - Math.abs(dy)) / (3 * this.node_height)) * (Math.min(this.node_width, Math.abs(dx)) / (this.node_width));
              }
            }

            d.x1 = d.source.x + d.source.w / 2;
            d.y1 = d.source.y + y;
            d.x2 = d.target.x - d.target.w / 2;
            d.y2 = d.target.y;

            return 'M ' + d.x1 + ' ' + d.y1 +
              ' C ' + (d.x1 + scale * this.node_width) + ' ' + (d.y1 + scaleY * this.node_height) + ' ' +
              (d.x2 - scale * this.node_width) + ' ' + (d.y2 - scaleY * this.node_height) + ' ' +
              d.x2 + ' ' + d.y2;
          });
        }
      })

      link.classed('link_selected', function (d) {
        return d === this.selected_link || d.selected;
      });
      link.classed('link_unknown', function (d) {
        delete d.added;
        return d.target.type == 'unknown' || d.source.type == 'unknown'
      });
      var offLinks = vis.selectAll('.link_flow_link_g').data(
        activeFlowLinks,
        function (d) {
          return d.node.id + ':' + d.refresh
        }
      );

      var offLinksEnter = offLinks.enter().insert('g', '.node').attr('class', 'link_flow_link_g');
      offLinksEnter.each(function (d, i) {
        var g = d3.select(this);
        var s = 1;
        var labelAnchor = 'start';
        if (d.node.type === 'link in') {
          s = -1;
          labelAnchor = 'end';
        }
        var stemLength = s * 30;
        var branchLength = s * 20;
        var l = g.append('svg:path').attr('class', 'link_flow_link')
          .attr('class', 'link_link').attr('d', 'M 0 0 h ' + stemLength);
        var links = d.links;
        var flows = Object.keys(links);
        var tabOrder = this.RED.nodes.getWorkspaceOrder();
        flows.sort(function (A, B) {
          return tabOrder.indexOf(A) - tabOrder.indexOf(B);
        });
        var linkWidth = 10;
        var h = this.node_height;
        var y = -(flows.length - 1) * h / 2;
        var linkGroups = g.selectAll('.link_group').data(flows);
        var enterLinkGroups = linkGroups.enter().append('g').attr('class', 'link_group')
          .on('mouseover', function () {
            d3.select(this).classed('link_group_active', true)
          })
          .on('mouseout', function () {
            d3.select(this).classed('link_group_active', false)
          })
          .on('mousedown', function () {
            d3.event.preventDefault();
            d3.event.stopPropagation();
          })
          .on('mouseup', (f) => {
            d3.event.stopPropagation();
            var targets = d.links[f];
            this.RED.workspaces.show(f);
            targets.forEach(function (n) {
              n.selected = true;
              n.dirty = true;
              this.moving_set.push({
                n: n
              });
            });
            this.updateSelection();
            this.redraw();
          });
        enterLinkGroups.each((f) => {
          var linkG = d3.select(this);
          linkG.append('svg:path').attr('class', 'link_flow_link')
            .attr('class', 'link_link')
            .attr('d',
            'M ' + stemLength + ' 0 ' +
            'C ' + (stemLength + (1.7 * branchLength)) + ' ' + 0 +
            ' ' + (stemLength + (0.1 * branchLength)) + ' ' + y + ' ' +
            (stemLength + branchLength * 1.5) + ' ' + y + ' '
            );
          linkG.append('svg:path')
            .attr('class', 'link_port')
            .attr('d',
            'M ' + (stemLength + branchLength * 1.5 + s * (linkWidth + 7)) + ' ' + (y - 12) + ' ' +
            'h ' + (-s * linkWidth) + ' ' +
            'a 3 3 45 0 ' + (s === 1 ? '0' : '1') + ' ' + (s * -3) + ' 3 ' +
            'v 18 ' +
            'a 3 3 45 0 ' + (s === 1 ? '0' : '1') + ' ' + (s * 3) + ' 3 ' +
            'h ' + (s * linkWidth)
            );
          linkG.append('svg:path')
            .attr('class', 'link_port')
            .attr('d',
            'M ' + (stemLength + branchLength * 1.5 + s * (linkWidth + 10)) + ' ' + (y - 12) + ' ' +
            'h ' + (s * (linkWidth * 3)) + ' ' +
            'M ' + (stemLength + branchLength * 1.5 + s * (linkWidth + 10)) + ' ' + (y + 12) + ' ' +
            'h ' + (s * (linkWidth * 3))
            ).style('stroke-dasharray', '12 3 8 4 3');
          linkG.append('rect').attr('class', 'port link_port')
            .attr('x', stemLength + branchLength * 1.5 - 4 + (s * 4))
            .attr('y', y - 4)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('width', 8)
            .attr('height', 8);
          linkG.append('rect')
            .attr('x', stemLength + branchLength * 1.5 - (s === -1 ? this.node_width : 0))
            .attr('y', y - 12)
            .attr('width', this.node_width)
            .attr('height', 24)
            .style('stroke', 'none')
            .style('fill', 'transparent')
          var tab = this.RED.nodes.workspace(f);
          var label;
          if (tab) {
            label = tab.label || tab.id;
          }
          linkG.append('svg:text')
            .attr('class', 'port_label')
            .attr('x', stemLength + branchLength * 1.5 + (s * 15))
            .attr('y', y + 1)
            .style('font-size', '10px')
            .style('text-anchor', labelAnchor)
            .text(label);

          y += h;
        });
        linkGroups.exit().remove();
      });
      offLinks.exit().remove();
      offLinks = vis.selectAll('.link_flow_link_g');
      offLinks.each(function (d) {
        var s = 1;
        if (d.node.type === 'link in') {
          s = -1;
        }
        var link = d3.select(this);
        link.attr('transform', function (d: any) {
          return 'translate(' + (d.node.x + (s * d.node.w / 2)) + ',' + (d.node.y) + ')';
        });

      })

    } else {
      // JOINING - unselect any selected links
      vis.selectAll('.link_selected').data(
        activeLinks,
        function (d) {
          return d.source.id + ':' + d.sourcePort + ':' + d.target.id + ':' + d.target.i;
        }
      ).classed('link_selected', false);
    }

    if (d3.event) {
      d3.event.preventDefault();
    }

    return this
  }
}
