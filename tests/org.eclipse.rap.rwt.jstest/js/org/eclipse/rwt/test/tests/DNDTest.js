/*******************************************************************************
 * Copyright (c) 2009, 2014 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/

rwt.qx.Class.define( "org.eclipse.rwt.test.tests.DNDTest", {
  extend : rwt.qx.Object,

  construct : function() {
    this.base( arguments );
  },

  members : {

    TARGETPLATFORM : [ "win", "mac", "unix", "other" ], // touch devices don't support DND (yet)

    testCreateDragSourceByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );

      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DragSource",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ]
        }
      } );

      var button = ObjectManager.getObject( "w3" );
      assertTrue( dndSupport.isDragSource( button ) );
      var actions = dndSupport._dragSources[ button.toHashCode() ].actions;
      var expected = {
        "copy" : true,
        "move" : true
      };
      assertEquals( expected, actions );
      button.destroy();
    },

    testDisposeDragSourceByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );
      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DragSource",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ]
        }
      } );

      var button = ObjectManager.getObject( "w3" );
      assertTrue( dndSupport.isDragSource( button ) );

      processor.processOperation( {
        "target" : "w4",
        "action" : "destroy"
      } );
      assertFalse( dndSupport.isDragSource( button ) );
      button.destroy();
    },

    testDisposeDragSourceWithControlByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );
      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DragSource",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ]
        }
      } );
      var button = ObjectManager.getObject( "w3" );

      processor.processOperation( {
        "target" : "w3",
        "action" : "destroy"
      } );

      assertFalse( dndSupport.isDragSource( button ) );
      button.destroy();
    },

    testSetDragSourceTransferByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );

      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DragSource",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ],
          "transfer" : [ "my", "transfer" ]
        }
      } );

      var button = ObjectManager.getObject( "w3" );
      assertTrue( dndSupport.isDragSource( button ) );
      var types = dndSupport._dragSources[ button.toHashCode() ].dataTypes;
      var expected = [ "my", "transfer" ];
      assertEquals( expected, types );
      button.destroy();
    },

    testCreateDropTargetByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );

      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DropTarget",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ]
        }
      } );

      var button = ObjectManager.getObject( "w3" );
      assertTrue( dndSupport.isDropTarget( button ) );
      var actions = dndSupport._dropTargets[ button.toHashCode() ].actions;
      var expected = {
        "copy" : true,
        "move" : true
      };
      assertEquals( expected, actions );
      button.destroy();
    },

    testDisposeDropTargetByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );
      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DropTarget",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ]
        }
      } );

      var button = ObjectManager.getObject( "w3" );
      assertTrue( dndSupport.isDropTarget( button ) );

      processor.processOperation( {
        "target" : "w4",
        "action" : "destroy"
      } );
      assertFalse( dndSupport.isDropTarget( button ) );
      button.destroy();
    },

    testDisposeDropTargetWithControlByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );
      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DropTarget",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ]
        }
      } );
      var button = ObjectManager.getObject( "w3" );

      processor.processOperation( {
        "target" : "w3",
        "action" : "destroy"
      } );

      assertFalse( dndSupport.isDropTarget( button ) );
      button.destroy();
    },

    testSetDropTargetTransferByProtocol : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var ObjectManager = rwt.remote.ObjectRegistry;
      TestUtil.createShellByProtocol( "w2" );
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : "w3",
        "action" : "create",
        "type" : "rwt.widgets.Button",
        "properties" : {
          "parent" : "w2",
          "style" : [ "PUSH" ]
        }
      } );

      processor.processOperation( {
        "target" : "w4",
        "action" : "create",
        "type" : "rwt.widgets.DropTarget",
        "properties" : {
          "control" : "w3",
          "style" : [ "DROP_COPY", "DROP_MOVE" ],
          "transfer" : [ "my", "transfer" ]
        }
      } );

      var button = ObjectManager.getObject( "w3" );
      assertTrue( dndSupport.isDropTarget( button ) );
      var types = button.getDropDataTypes();
      var expected = [ "my", "transfer" ];
      assertEquals( expected, types );
      button.destroy();
    },


    testEventListener : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      assertTrue( source.control.hasEventListeners( "dragstart" ) );
      assertTrue( source.control.hasEventListeners( "dragend" ) );
      assertTrue( target.control.hasEventListeners( "dragover" ) );
      assertTrue( target.control.hasEventListeners( "dragmove" ) );
      assertTrue( target.control.hasEventListeners( "dragout" ) );
      assertTrue( target.control.hasEventListeners( "dragdrop" ) );
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      assertFalse( source.control.hasEventListeners( "dragstart" ) );
      assertFalse( source.control.hasEventListeners( "dragend" ) );
      assertFalse( target.control.hasEventListeners( "dragover" ) );
      assertFalse( target.control.hasEventListeners( "dragmove" ) );
      assertFalse( target.control.hasEventListeners( "dragout" ) );
      assertFalse( target.control.hasEventListeners( "dragdrop" ) );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testHashMaps : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      assertTrue( typeof source == "object" );
      assertTrue( source.actions.copy );
      assertTrue( source.actions.move );
      assertTrue( source.actions.alias );
      assertTrue( source.dataTypes[ 0 ] == "default" );
      assertTrue( typeof target == "object" );
      assertTrue( target.actions.copy );
      assertTrue( target.actions.move );
      assertTrue( target.actions.alias );
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      assertFalse( dndSupport.isDragSource( source.control ) );
      assertFalse( dndSupport.isDropTarget( target.control ) );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    // TODO [tb] : fix order within tests (asserts at end)
    testDragStartAndFinish : function() {
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var node = source.control._getTargetNode();

      TestUtil.fakeMouseEventDOM( node, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( node, "mousemove", leftButton, 19, 19 );
      assertEquals( 1, TestUtil.getRequestsSend() );
      assertNotNull( TestUtil.getMessageObject().findNotifyOperation( "ds#w11", "DragStart" ) );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( node, "mouseup", leftButton, 19, 19 );

      assertEquals( 1, TestUtil.getRequestsSend() );
      assertNotNull( TestUtil.getMessageObject().findNotifyOperation( "ds#w11", "DragEnd" ) );
      assertFalse( dndSupport._blockDrag );
      dndSupport.deregisterDragSource( source );
      source.control.setParent( null );
      source.control.destroy();
      TestUtil.flush();
    },

    testDragEndPropagation : function() {
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var leftButton = rwt.event.MouseEvent.buttons.left;
      var log = [];
      TestUtil.getDocument().addEventListener( "dragend", function( event ) {
        log.push( event );
      } );
      var source = this.createDragSource();
      var node = source.control._getTargetNode();

      TestUtil.fakeMouseEventDOM( node, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( node, "mousemove", leftButton, 19, 19 );
      TestUtil.fakeMouseEventDOM( node, "mouseup", leftButton, 19, 19 );

      assertEquals( 0, log.length );
      dndSupport.deregisterDragSource( source );
      source.control.destroy();
      TestUtil.flush();
    },

    testDragStartAndCancel : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var node = source.control._getTargetNode();

      TestUtil.fakeMouseEventDOM( node, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( node, "mousemove", leftButton, 19, 19 );
      dndSupport.cancel();

      assertEquals( 1, TestUtil.getRequestsSend() );
      assertNotNull( TestUtil.getMessageObject().findNotifyOperation( "ds#w11", "DragStart" ) );
      assertNull( dndHandler.__dragCache );
      assertEquals( 1, TestUtil.getRequestsSend() ); // no dragFinished
      assertFalse( dndSupport._blockDrag );
      dndSupport.deregisterDragSource( source );
      source.control.setParent( null );
      source.control.destroy();
      TestUtil.flush();
    },

    testDragEnterOverLeave : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertEquals( 1, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject();
      assertEquals( 25, message.findNotifyProperty( "ds#w11", "DragStart", "x" ) );
      assertEquals( 15, message.findNotifyProperty( "ds#w11", "DragStart", "y" ) );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      // Over
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject();
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DragEnter", "source" ) );
      assertEquals( 32, message.findNotifyProperty( "dt#w2", "DragEnter", "x" ) );
      assertEquals( 15, message.findNotifyProperty( "dt#w2", "DragEnter", "y" ) );
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DragOver", "source" ) );
      assertEquals( 32, message.findNotifyProperty( "dt#w2", "DragOver", "x" ) );
      assertEquals( 15, message.findNotifyProperty( "dt#w2", "DragOver", "y" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // Move
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 33, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject();
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DragOver", "source" ) );
      assertEquals( 33, message.findNotifyProperty( "dt#w2", "DragOver", "x" ) );
      assertEquals( 15, message.findNotifyProperty( "dt#w2", "DragOver", "y" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // Out
      TestUtil.fakeMouseEventDOM( targetNode, "mouseout", leftButton, 41, 15 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 42, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject();
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DragLeave", "source" ) );
      assertEquals( 42, message.findNotifyProperty( "dt#w2", "DragLeave", "x" ) );
      assertEquals( 15, message.findNotifyProperty( "dt#w2", "DragLeave", "y" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    // See Bug 301434
    testEnterEventOnDragStart: function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      // request uses SWT-like event-names:
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      target.control.setLocation( 10, 20 );
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      TestUtil.clearRequestLog();

      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 19 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 11, 25 );
      TestUtil.forceTimerOnce();

      assertEquals( 2, TestUtil.getRequestsSend() );
      assertNotNull( TestUtil.getMessageObject( 0 ).findNotifyOperation( "ds#w11", "DragStart" ) );
      assertNotNull( TestUtil.getMessageObject( 1 ).findNotifyOperation( "dt#w2", "DragEnter" ) );
      assertNotNull( TestUtil.getMessageObject( 1 ).findNotifyOperation( "dt#w2", "DragOver" ) );
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
    },

    // See Bug 301276
    testSetPropertyRetroactively : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      // Over
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      TestUtil.forceTimerOnce();
      assertEquals( 2, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject( 1 );
      assertEquals( null, message.findNotifyProperty( "dt#w2", "DragEnter", "dataType" ) );
      assertEquals( "move", message.findNotifyProperty( "dt#w2", "DragEnter", "operation" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // Move
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 33, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      // set properties
      target.changeDataType( "76135" );
      target.changeDetail( "copy" );
      // send event:
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject( 0 );
      assertEquals( "copy", message.findNotifyProperty( "dt#w2", "DragOver", "operation" ) );
      assertEquals( 76135, message.findNotifyProperty( "dt#w2", "DragOver", "dataType" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    // for Bug 299034
    testStopDropEventPropagation : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var parentTarget = new rwt.widgets.base.Parent();
      parentTarget.setLocation( 10, 10 );
      parentTarget.setDimension( 100, 100 );
      parentTarget.addToDocument();
      rwt.remote.WidgetManager.getInstance().add( parentTarget, "w3" );
      parentTarget.setUserData( "isControl", true );
      this.createDropTarget( parentTarget );
      target.control.setParent( parentTarget );
      var targetLog = [];
      var parentTargetLog = [];
      var addToTargetLog = function( value ){
        targetLog.push( value );
      };
      var addToParentTargetLog = function( value ){
        parentTargetLog.push( value );
      };
      parentTarget.addEventListener( "dragover", addToParentTargetLog );
      parentTarget.addEventListener( "dragmove", addToParentTargetLog );
      parentTarget.addEventListener( "dragout", addToParentTargetLog );
      parentTarget.addEventListener( "dragdrop", addToParentTargetLog );
      target.control.addEventListener( "dragover", addToTargetLog );
      target.control.addEventListener( "dragmove", addToTargetLog );
      target.control.addEventListener( "dragout", addToTargetLog );
      target.control.addEventListener( "dragdrop", addToTargetLog );
      org.eclipse.rwt.test.fixture.TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      // Over + move
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      // Move
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 33, 15 );
      // Out
      TestUtil.fakeMouseEventDOM( targetNode, "mouseout", leftButton, 41, 15 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 42, 15 );
      // Over + move
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      // Drop
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton, 32, 16 );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      assertEquals( 0, parentTargetLog.length );
      assertEquals( 7, targetLog.length );
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testIgnorePassOverTarget : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertEquals( 1, TestUtil.getRequestsSend() );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      // Simulate over->move->out, results in no request send
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseout", leftButton, 41, 15 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 42, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      assertNull( TestUtil.getMessageObject().findNotifyOperation( "dt#w2", "DragLeave" ) );
      assertNull( TestUtil.getMessageObject().findNotifyOperation( "dt#w2", "DragOver" ) );
      assertNull( TestUtil.getMessageObject().findNotifyOperation( "dt#w2", "dragMove" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testIgnorePassOverTargetAfterLeave : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;

      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertEquals( 1, TestUtil.getRequestsSend() );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      // Over
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // Simulate move->out->over->move->out, results in out only
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 33, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseout", leftButton, 41, 15 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 42, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseout", leftButton, 41, 15 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 42, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();

      assertEquals( 1, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject();
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DragLeave", "source" ) );
      assertEquals( 42, message.findNotifyProperty( "dt#w2", "DragLeave", "x" ) );
      assertEquals( 15, message.findNotifyProperty( "dt#w2", "DragLeave", "y" ) );
      assertNull( message.findNotifyOperation( "dt#w2", "DragOver" ) );
      assertNull( message.findNotifyOperation( "dt#w2", "DragEnter" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testDragStartAndDrop : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertEquals( 1, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyProperty( "ds#w11", "DragStart" ) );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      // Over
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyProperty( "dt#w2", "DragEnter" ) );
      assertNotNull( message.findNotifyProperty( "dt#w2", "DragOver" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // Drop
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton, 32, 16 );
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject();
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DropAccept", "source" ) );
      assertEquals( 32, message.findNotifyProperty( "dt#w2", "DropAccept", "x" ) );
      assertEquals( 16, message.findNotifyProperty( "dt#w2", "DropAccept", "y" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },


    testFakeMouseEvents : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var log = [];
      source.control.addEventListener( "mouseout", function( event ) {
        log.push( event );
      }, this );
      target.control.addEventListener( "mouseover", function( event ) {
        log.push( event );
      }, this );
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( sourceNode, "mousemove", leftButton, 25, 15 );
      assertEquals( 1, log.length );
      assertTrue( log[ 0 ] instanceof rwt.event.MouseEvent );
      assertEquals( "mouseout", log[ 0 ].getType() );
      // Over
      TestUtil.fakeMouseEventDOM( sourceNode, "mouseout", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      // drop
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton );
      assertEquals( 2, log.length );
      assertTrue( log[ 1 ] instanceof rwt.event.MouseEvent );
      assertEquals( "mouseover", log[ 1 ].getType() );
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testMouseupOutOfDocument : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      // Over
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      // mouseup out of document
      // ( no need to simulate )
      // mousdown
      TestUtil.clearTimerOnceLog();
      rwt.remote.Connection.getInstance().send();
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( targetNode, "mousedown", leftButton, 32, 16 );
      // mouseup
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton, 32, 16 );
      TestUtil.forceTimerOnce();
      assertEquals( 2, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject();
      assertEquals( "w11", message.findNotifyProperty( "dt#w2", "DropAccept", "source" ) );
      assertEquals( 32, message.findNotifyProperty( "dt#w2", "DropAccept", "x" ) );
      assertEquals( 16, message.findNotifyProperty( "dt#w2", "DropAccept", "y" ) );
      assertNotNull( message.findNotifyProperty( "ds#w11", "DragEnd" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testTreeInsertAfterIndicator : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      var item0 = this.createTreeItem( 1, tree, tree );
      this.createTreeItem( 2, tree, item0 );
      var source = this.createDragSource();
      item0.setExpanded( true );
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 1 ]._getTargetNode();
      var treeNode = tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // Over
      TestUtil.fakeMouseEventDOM( treeNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( treeNode, "mousemove", leftButton );
      assertEquals( tree, dndSupport._currentDropControl );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      dndSupport.setFeedback( tree, [ "FEEDBACK_INSERT_AFTER" ] );
      assertNotNull( dndSupport._dropFeedbackRenderer );
      TestUtil.flush();
      var indicator = dndSupport._dropFeedbackRenderer._insertIndicator;
      assertNotNull( indicator );
      assertIdentical( tree._getTargetNode(), indicator.parentNode );
      var bounds = TestUtil.getElementBounds( indicator );
      assertEquals( 31, bounds.top );
      assertEquals( 0, bounds.left );
      assertEquals( 358, bounds.width );
      assertEquals( 2, bounds.height );
      // drop
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      if( rwt.client.Client.getEngine() != "mshtml" ) {
        // TODO [tb] : does not succeed in IE unless the debugger is running
        assertNull( indicator.parentNode );
      }
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeInsertBeforeIndicator : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      var item0 = this.createTreeItem( 1, tree, tree );
      this.createTreeItem( 2, tree, item0 );
      var source = this.createDragSource();
      item0.setExpanded( true );
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 1 ]._getTargetNode();
      var treeNode = tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // Over
      TestUtil.fakeMouseEventDOM( treeNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( treeNode, "mousemove", leftButton );
      assertEquals( tree, dndSupport._currentDropControl );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      dndSupport.setFeedback( tree, [ "FEEDBACK_INSERT_BEFORE" ] );
      assertNotNull( dndSupport._dropFeedbackRenderer );
      TestUtil.flush();
      var indicator = dndSupport._dropFeedbackRenderer._insertIndicator;
      assertNotNull( indicator );
      assertIdentical( tree._getTargetNode(), indicator.parentNode );
      var bounds = TestUtil.getElementBounds( indicator );
      assertEquals( 15, bounds.top );
      assertEquals( 0, bounds.left );
      assertEquals( 358, bounds.width );
      assertEquals( 2, bounds.height );
      // drop
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      if( rwt.client.Client.getEngine() != "mshtml" ) {
        // TODO [tb] : does not succeed in IE unless the debugger is running
        assertNull( indicator.parentNode );
      }
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeFeedbackSelect : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      var item0 = this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 1, tree, item0 );
      var source = this.createDragSource();
      item0.setExpanded( true );
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 1 ]._getTargetNode();
      var treeNode = tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // Over
      TestUtil.fakeMouseEventDOM( treeNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( treeNode, "mousemove", leftButton );
      assertEquals( tree, dndSupport._currentDropControl );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      dndSupport.setFeedback( tree, [ "FEEDBACK_SELECT" ] );
      assertNotNull( dndSupport._dropFeedbackRenderer );
      TestUtil.flush();
      var row = tree._rowContainer._children[ 1 ];
      assertTrue( row.hasState( "dnd_selected") );
      assertNull( row.getBackgroundColor() ); // hover disabled
      assertTrue( row._overlayElement.style.backgroundColor !== "" );
      // drop
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton );
      assertTrue( row._overlayElement.style.display == "none" );
      // NOTE: hover effect temporarily disabled on trees without FULL_SELECTION
      //assertEquals( "#b5b5b5", tree._rowContainer._children[ 1 ].getBackgroundColor() );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeFeedbackExpand : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      var item0 = this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 0, tree, item0 );
      var source = this.createDragSource();
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 0 ]._getTargetNode();
      var treeNode = tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      assertFalse( item0.isExpanded() );
      // Over
      TestUtil.fakeMouseEventDOM( treeNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( treeNode, "mousemove", leftButton );
      assertEquals( tree, dndSupport._currentDropControl );
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      dndSupport.setFeedback( tree, [ "FEEDBACK_EXPAND" ] );
      assertNotNull( dndSupport._dropFeedbackRenderer );
      assertNotNull( dndSupport._dropFeedbackRenderer._expandTimer );
      TestUtil.clearTimerOnceLog();
      TestUtil.forceInterval( dndSupport._dropFeedbackRenderer._expandTimer );
      TestUtil.flush();
      TestUtil.forceTimerOnce(); // Tree uses timer for in method "open"
      assertTrue( item0.isExpanded() );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    // NOTE [tb] : this tests can fail if when its DNDTest is executed on its own. Reason unkown.
    testTreeFeedbackScroll : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 1, tree, tree );
      this.createTreeItem( 2, tree, tree );
      this.createTreeItem( 3, tree, tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 1 ]._getTargetNode();
      var treeNode = tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // Over tree
      TestUtil.fakeMouseEventDOM( treeNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( treeNode, "mousemove", leftButton );
      assertEquals( tree, dndSupport._currentDropControl );
      // over item 2
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertIdentical( tree._rowContainer._children[ 1 ], dndSupport._getCurrentFeedbackTarget() );
      assertNull( dndSupport._dropFeedbackRenderer );
      dndSupport.setFeedback( tree, [ "FEEDBACK_SCROLL" ] );
      // setting feedback
      var feedback = dndSupport._dropFeedbackRenderer;
      assertNotNull( feedback );
      assertEquals( 0, tree._topItemIndex );
      //assertEquals( 1, feedback._getScrollDirection( 1 ) );
      TestUtil.clearTimerOnceLog();
      // scroll to item 3
      TestUtil.forceInterval( dndSupport._dropFeedbackRenderer._scrollTimer );
      TestUtil.flush();
      assertEquals( 1, tree._topItemIndex );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();

      // scroll to item 4
      TestUtil.forceInterval( dndSupport._dropFeedbackRenderer._scrollTimer );
      TestUtil.flush();
      assertEquals( 2, tree._topItemIndex );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      // drop
      TestUtil.fakeMouseEventDOM( treeNode, "mouseup", leftButton );
      assertNull( dndSupport._dropFeedbackRenderer );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeFeedbackScroll_EmptryRow : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      this.createTreeItem( 0, tree, tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 1 ]._getTargetNode();
      var treeNode = tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      // Over tree
      TestUtil.fakeMouseEventDOM( treeNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( treeNode, "mousemove", leftButton );
      // over row 2 (empty)
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertIdentical( tree._rowContainer._children[ 1 ], dndSupport._getCurrentFeedbackTarget() );
      dndSupport.setFeedback( tree, [ "FEEDBACK_SCROLL" ] );
      TestUtil.forceInterval( dndSupport._dropFeedbackRenderer._scrollTimer );
      TestUtil.flush();

      assertEquals( 0, tree._topItemIndex );

      TestUtil.fakeMouseEventDOM( treeNode, "mouseup", leftButton );
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.destroy();
      tree.destroy();
    },

    testTreeRequestItem : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 1, tree, tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._children[ 1 ]._getTargetNode();
      tree.getElement();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // over item 2
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      // drop
      TestUtil.initRequestLog();
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton );
      assertEquals( 1, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject();
      assertEquals( "w3", message.findNotifyProperty( "dt#w2", "DropAccept", "item" ) );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeRequestItemOutsideRow : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 1, tree, tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // over clientArea
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      // drop
      rwt.remote.Connection.getInstance().send();
      TestUtil.initRequestLog();
      TestUtil.fakeMouseEventDOM( targetNode, "mouseup", leftButton );
      TestUtil.forceTimerOnce();
      // TODO [tb] : drop and dragEnd may be sent in two different requests?
      assertTrue( TestUtil.getRequestsSend() >= 1 );
      assertNull( TestUtil.getMessageObject().findNotifyProperty( "dt#w2", "DropAccept", "item" ) );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeRequestItemOutsideRow_Bug_345692 : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 1, tree, tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var sourceNode = source.control._getTargetNode();
      var targetNode = tree._rowContainer.getChildren()[ 0 ]._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // over treeRow
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton );
      assertTrue( dndSupport._currentTargetWidget instanceof rwt.widgets.base.GridRow );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton );
      assertTrue( dndSupport._isDropTargetEventScheduled( "DragEnter" ) );
      dndSupport._cancelDropTargetEvent( "DragEnter" );
      dndSupport._cancelDropTargetEvent( "DragOver" );
      // over clientArea
      // NOTE: IE may fire mousemove before mouseover, See Bug 345692
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton );
      assertFalse( dndSupport._currentTargetWidget instanceof rwt.widgets.base.GridRow );
      TestUtil.fakeMouseEventDOM( doc, "mouseover", leftButton );
      TestUtil.forceTimerOnce();
      assertEquals( 2, TestUtil.getRequestsSend() );
      assertNull( TestUtil.getMessageObject( 1 ).findNotifyProperty( "dt#w2", "DragLeave", "item" ) );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeRequestItemIsSourceItem: function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      // Target is also source:
      this.createDragSource( tree );
      this.createTreeItem( 0, tree, tree );
      this.createTreeItem( 1, tree, tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var itemNode0 = tree._rowContainer._children[ 0 ]._getTargetNode();
      var itemNode1 = tree._rowContainer._children[ 1 ]._getTargetNode();
      // drag
      TestUtil.fakeMouseEventDOM( itemNode0, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( itemNode0, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      // over next item
      TestUtil.fakeMouseEventDOM( itemNode1, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( itemNode1, "mousemove", leftButton );
      rwt.remote.Connection.getInstance().send();
      TestUtil.initRequestLog();
      TestUtil.clearTimerOnceLog();
      // over itself
      TestUtil.fakeMouseEventDOM( itemNode0, "mouseover", leftButton );
      TestUtil.fakeMouseEventDOM( itemNode0, "mousemove", leftButton );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      var message = TestUtil.getMessageObject();
      assertEquals( "w2", message.findNotifyProperty( "dt#w2", "DragOver", "item" ) );
      // drop
      TestUtil.fakeMouseEventDOM( itemNode1, "mouseup", leftButton );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testTreeDragEmptyRow: function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      var target = this.createDropTargetWithTree();
      var tree = target.control;
      // Target is also source:
      this.createDragSource( tree );
      var source = this.createDragSource();
      TestUtil.flush();
      var itemNode0 = tree._rowContainer._children[ 0 ]._getTargetNode();
      var itemNode1 = tree._rowContainer._children[ 1 ]._getTargetNode();
      // drag
      TestUtil.initRequestLog();
      TestUtil.clearTimerOnceLog();
      TestUtil.fakeMouseEventDOM( itemNode0, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( itemNode0, "mousemove", leftButton, 25, 15 );
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      assertEquals( 2, TestUtil.getRequestsSend() );
      assertNotNull( TestUtil.getMessageObject().findNotifyOperation( "ds#w2", "DragStart" ) );
      assertNull( TestUtil.getMessageObject( 1 ).findNotifyProperty( "dt#w2", "DragEnter", "item" ) );
      // drop
      TestUtil.fakeMouseEventDOM( itemNode1, "mouseup", leftButton );
      source.control.setParent( null );
      source.control.destroy();
      tree.destroy();
    },

    testFeedbackWidgetTree : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      var argsMap = {
        "appearance" : "tree",
        "selectionPadding" : [ 2, 2 ]
      };
      var tree = new rwt.widgets.Grid( argsMap );
      tree.setItemMetrics( 0, 0, 500, 0, 0, 0, 500 );
      rwt.remote.WidgetManager.getInstance().add( tree, "w2" );
      tree.setUserData( "isControl", true );
      tree.setSpace( 13, 364, 27, 30 );
      tree.addToDocument();
      var source = this.createDragSource( tree );
      this.createTreeItem( 0, tree, tree );
      TestUtil.flush();
      var sourceNode = tree._rowContainer._children[ 0 ]._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      TestUtil.flush();
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      var widget = dndSupport._dragFeedbackWidget;
      assertTrue( widget instanceof rwt.widgets.base.MultiCellWidget );
      assertIdentical( widget, dndHandler.__feedbackWidget );
      assertEquals( "text2", widget.getCellContent( 1 ) );
      dndSupport.cancel();
      assertEquals( null, dndHandler.__feedbackWidget );
      dndSupport.deregisterDragSource( source );
      tree.setParent( null );
      tree.destroy();
      TestUtil.flush();
    },

    testFeedbackWidgetEscape : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      var argsMap = {
        "appearance" : "tree",
        "selectionPadding" : [ 2, 2 ]
      };
      var tree = new rwt.widgets.Grid( argsMap );
      tree.setItemMetrics( 0, 0, 500, 0, 0, 0, 500 );
      rwt.remote.WidgetManager.getInstance().add( tree, "w2" );
      tree.setUserData( "isControl", true );
      tree.setSpace( 13, 364, 27, 30 );
      tree.addToDocument();
      var source = this.createDragSource( tree );
      this.createTreeItem( 0, tree, tree ).setTexts( [ "te&st" ] );
      TestUtil.flush();
      var sourceNode = tree._rowContainer._children[ 0 ]._getTargetNode();

      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( document.body, "mousemove", leftButton, 25, 15 );
      tree._scheduleUpdate(); // rendering that could crash
      TestUtil.flush();

      var widget = dndSupport._dragFeedbackWidget;
      assertEquals( "te&amp;st", widget.getCellContent( 1 ) );
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      tree.destroy();
    },

    testFeedbackWidgetTreeWithImage : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      var leftButton = rwt.event.MouseEvent.buttons.left;
      var argsMap = {
        "appearance" : "tree",
        "selectionPadding" : [ 2, 2 ]
      };
      var tree = new rwt.widgets.Grid( argsMap );
      rwt.remote.WidgetManager.getInstance().add( tree, "w2" );
      tree.setUserData( "isControl", true );
      tree.setSpace( 13, 364, 27, 30 );
      tree.setItemMetrics( 0, 50, 40, 50, 12, 65, 12 );
      tree.addToDocument();
      var source = this.createDragSource( tree );
      var item0 = this.createTreeItem( 0, tree, tree );
      item0.setImages( [ [ "bla.jpg", 10, 10 ] ] );
      TestUtil.flush();
      var sourceNode = tree._rowContainer._children[ 0 ]._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      TestUtil.flush();
      assertNotNull( dndHandler.__dragCache );
      assertTrue( dndHandler.__dragCache.dragHandlerActive );
      var widget = dndSupport._dragFeedbackWidget;
      assertTrue( widget instanceof rwt.widgets.base.MultiCellWidget );
      assertIdentical( widget, dndHandler.__feedbackWidget );
      assertEquals( "bla.jpg", widget.getCellContent( 0 ) );
      assertEquals( [ 12, 16 ], widget.getCellDimension( 0 ) );
      assertEquals( "text2", widget.getCellContent( 1 ) );
      dndSupport.cancel();
      assertEquals( null, dndHandler.__feedbackWidget );
      dndSupport.deregisterDragSource( source );
      tree.setParent( null );
      tree.destroy();
      TestUtil.flush();
    },

    testOperationChanged : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      dndHandler.__dragCache = null;
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var target = this.createDropTarget();
      var sourceNode = source.control._getTargetNode();
      var targetNode = target.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      var message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyOperation( "ds#w11", "DragStart" ) );
      TestUtil.clearRequestLog();
      TestUtil.clearTimerOnceLog();
      // Over
      TestUtil.fakeMouseEventDOM( targetNode, "mouseover", leftButton, 31, 15 );
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 32, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyOperation( "dt#w2", "DragEnter" ) );
      assertNull( message.findNotifyOperation( "dt#w2", "DragOperationChanged" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // Move
      TestUtil.fakeMouseEventDOM( targetNode, "mousemove", leftButton, 33, 15 );
      assertTrue( TestUtil.getTimerOnceLog().length > 0 );
      TestUtil.forceTimerOnce();
      message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyOperation( "dt#w2", "DragOver" ) );
      assertNull( message.findNotifyOperation( "dt#w2", "DragOperationChanged" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      // NOTE : Currently the only way to test the operationChanged event,
      //        since TestUtil can not yet fake modifiers in domEvents
      dndSupport._setAction( "none", {} );
      TestUtil.forceTimerOnce();
      assertEquals( 1, TestUtil.getRequestsSend() );
      message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyOperation( "dt#w2", "DragOperationChanged" ) );
      assertEquals( "none", message.findNotifyProperty( "dt#w2", "DragOperationChanged", "operation" ) );
      TestUtil.clearTimerOnceLog();
      TestUtil.clearRequestLog();
      dndSupport.cancel();
      dndSupport.deregisterDragSource( source );
      dndSupport.deregisterDropTarget( target );
      source.control.setParent( null );
      source.control.destroy();
      target.control.setParent( null );
      target.control.destroy();
      TestUtil.flush();
    },

    testCancelDragFromServerSide : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      dndHandler.__dragCache = null;
      var leftButton = rwt.event.MouseEvent.buttons.left;
      TestUtil.prepareTimerUse();
      TestUtil.initRequestLog();
      var source = this.createDragSource();
      var dragSource = this.createDragSourceByProtocol( "w123", "w11" );
      var sourceNode = source.control._getTargetNode();
      var doc = document.body;
      // drag
      TestUtil.fakeMouseEventDOM( sourceNode, "mousedown", leftButton, 11, 11 );
      TestUtil.clearRequestLog();
      TestUtil.fakeMouseEventDOM( doc, "mousemove", leftButton, 25, 15 );
      var message = TestUtil.getMessageObject();
      assertNotNull( message.findNotifyOperation( "w123", "DragStart" ) );

      TestUtil.protocolCall( "w123", "cancel", {} );
      var dndHandler = rwt.event.DragAndDropHandler.getInstance();
      assertNull( dndHandler.__dragCache );

      rwt.remote.MessageProcessor.processOperation( {
        "target" : "w123",
        "action" : "destroy"
      } );
      dndSupport.deregisterDragSource( source );
      source.control.setParent( null );
      source.control.destroy();
      TestUtil.flush();
    },

    /////////
    // Helper

    createDragSourceByProtocol : function( id, controlId ) {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var processor = rwt.remote.MessageProcessor;
      processor.processOperation( {
        "target" : id,
        "action" : "create",
        "type" : "rwt.widgets.DragSource",
        "properties" : {
          "control" : controlId,
          "style" : [ "DROP_COPY", "DROP_MOVE" ],
          "transfer" : [ "default" ]
        }
      } );
      TestUtil.protocolListen( id, { "DragStart" : true, "DragEnd" : true } );
      return rwt.remote.ObjectRegistry.getObject( id );
    },

    createDropTargetWithTree : function() {
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      var dndSupport = rwt.remote.DNDSupport.getInstance();
      var argsMap = {
        "appearance" : "tree",
        "selectionPadding" : [ 2, 2 ]
      };
      TestUtil.fakeAppearance( "tree-row",  {
        style : function( states ) {
          return {
            "background" : states.over ? "#b5b5b5" : "undefined",
            "backgroundGradient" : null,
            "backgroundImage" : null,
            "foreground" : "undefined",
            "checkBox" : null
          };
        }
      } );
      TestUtil.fakeAppearance( "tree-row-overlay",  {
        style : function( states ) {
          return {
            "background" : states.selected ? "blue" : "undefined",
            "backgroundGradient" : null,
            "backgroundImage" : null,
            "foreground" : "undefined",
            "checkBox" : null
          };
        }
      } );
      var tree = new rwt.widgets.Grid( argsMap );
      var gridHandler = rwt.remote.HandlerRegistry.getHandler( "rwt.widgets.Grid" );
      var barHandler = rwt.remote.HandlerRegistry.getHandler( "rwt.widgets.ScrollBar" );
      rwt.remote.ObjectRegistry.add( "w2", tree, gridHandler );
      rwt.remote.ObjectRegistry.add( "w2_vscroll", tree.getVerticalBar(), barHandler );
      rwt.remote.ObjectRegistry.add( "w2_hscroll", tree.getHorizontalBar(), barHandler );
      tree.setUserData( "isControl", true );
      tree.setSpace( 13, 364, 27, 30 );
      tree.setItemMetrics( 0, 0, 500, 0, 0, 0, 500 );
      tree.addToDocument();
      this.setHasDragDropListeners( tree, true );
      return this.createDropTarget( tree );
    },

    createDragSource : function( control ) {
      var dragControl = control;
      if( !control ) {
        var dragControl = new rwt.widgets.base.Atom();
        dragControl.setLocation( 10, 10 );
        dragControl.setDimension( 10, 10 );
        dragControl.addToDocument();
        rwt.remote.WidgetManager.getInstance().add( dragControl, "w11" );
        dragControl.setUserData( "isControl", true );
        org.eclipse.rwt.test.fixture.TestUtil.flush();
      }
      var controlId = rwt.remote.ObjectRegistry.getId( dragControl );
      var operations = [ "DROP_COPY", "DROP_MOVE", "DROP_LINK" ];
      var dragSource = new rwt.widgets.DragSource( dragControl, operations );
      rwt.remote.ObjectRegistry.add( "ds#" + controlId, dragSource );
      this.setHasDragDropListeners( dragSource, true );
      dragSource.setTransfer( [ "default" ] );
      return dragSource;
    },

    createDropTarget : function( control ) {
      var dropControl = control;
      if( !control ) {
        var dropControl = new rwt.widgets.base.Atom();
        dropControl.setLocation( 30, 10 );
        dropControl.setDimension( 10, 10 );
        dropControl.addToDocument();
        rwt.remote.WidgetManager.getInstance().add( dropControl, "w2" );
        dropControl.setUserData( "isControl", true );
        org.eclipse.rwt.test.fixture.TestUtil.flush();
      }
      var controlId = rwt.remote.ObjectRegistry.getId( dropControl );
      var operations = [ "DROP_COPY", "DROP_MOVE", "DROP_LINK" ];
      var dropTarget = new rwt.widgets.DropTarget( dropControl, operations );
      rwt.remote.ObjectRegistry.add( "dt#" + controlId, dropTarget );
      this.setHasDragDropListeners( dropTarget, true );
      dropTarget.setTransfer( [ "default" ] );
      return dropTarget;
    },

    setHasDragDropListeners : function( widget, value ) {
      this.setHasListener( widget, "DragStart", value );
      this.setHasListener( widget, "DragEnd", value );
      this.setHasListener( widget, "DragEnter", value );
      this.setHasListener( widget, "DragOver", value );
      this.setHasListener( widget, "DragLeave", value );
      this.setHasListener( widget, "DragOperationChanged", value );
      this.setHasListener( widget, "DropAccept", value );
    },

    setHasListener : function( widget, type, value ) {
      var remoteObject = rwt.remote.RemoteObjectFactory.getRemoteObject( widget );
      remoteObject._.listen[ type ] = value;
    },

    createTreeItem : function( itemNr, tree, parent ) {
      var nr = itemNr + 2;
      var parentItem = rwt.widgets.GridItem._getItem( parent );
      parentItem.setItemCount( itemNr + 1 );
      var item = new rwt.widgets.GridItem( parentItem, itemNr );
      var wm = rwt.remote.WidgetManager.getInstance();
      wm.add( item, "w" + nr, false );
      item.setTexts( [ "text" + nr ] );
      item.setImages( [ null ] );
      return item;
    },

    createTable : function() {
      var wm = rwt.remote.WidgetManager.getInstance();
      var table = new rwt.widgets.Grid( "w2", "|multi" );
      wm.add( table, "w2", true );
      table.addToDocument();
      table.setSpace( 13, 360, 27, 147 );
      table.setItemHeight( 17 );
      table.setItemMetrics( 0, 0, 105, 2, 0, 2, 101 );
      table.setItemMetrics( 1, 105, 104, 107, 0, 107, 100 );
      table.updateRows();
      table.setItemCount( 4 );
      table.setScrollBarsVisibile( false, true );
      var w = new rwt.widgets.GridColumn( table );
      wm.add( w, "w3", false );
      w.setLabel( "" );
      w.setWidth( 105 );
      w = new rwt.widgets.GridColumn( table );
      wm.add( w, "w4", false );
      w.setLabel( "" );
      w.setLeft( 105 );
      w.setWidth( 104 );
      w.setZIndex( 299 );
      w = new rwt.widgets.GridItem( table, 0 );
      wm.add( w, "w5", false );
      w.setTexts( [ "Item name 1", "Item Value 1" ] );
      w.update();
      w = new rwt.widgets.GridItem( table, 0 );
      wm.add( w, "w6", false );
      w.setTexts( [ "Item name 2", "Item Value 2" ] );
      w.update();
      w = new rwt.widgets.GridItem( table, 0 );
      wm.add( w, "w7", false );
      w.setTexts( [ "Item name 3", "Item Value 3" ] );
      w.update();
      w = new rwt.widgets.GridItem( table, 0 );
      wm.add( w, "w8", false );
      w.setTexts( [ "Item name 4", "Item Value 4" ] );
      w.update();
      var TestUtil = org.eclipse.rwt.test.fixture.TestUtil;
      TestUtil.flush(); // creates table
      TestUtil.flush(); // creates rows
      return table;
    },

    disposeTable : function() {
      var wm = rwt.remote.WidgetManager.getInstance();
      wm.dispose( "w2" );
      wm.dispose( "w3" );
      wm.dispose( "w4" );
      org.eclipse.rwt.test.fixture.TestUtil.flush();
    }
  }

} );
