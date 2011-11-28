/*******************************************************************************
 * Copyright (c) 2010, 2011 EclipseSource and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *    EclipseSource - initial API and implementation
 ******************************************************************************/
package org.eclipse.swt.internal.widgets.canvaskit;

import java.io.IOException;

import junit.framework.TestCase;

import org.eclipse.rap.rwt.testfixture.Fixture;
import org.eclipse.rap.rwt.testfixture.Message;
import org.eclipse.rap.rwt.testfixture.Message.CreateOperation;
import org.eclipse.rap.rwt.testfixture.Message.DestroyOperation;
import org.eclipse.rwt.lifecycle.PhaseId;
import org.eclipse.rwt.lifecycle.WidgetUtil;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.PaintEvent;
import org.eclipse.swt.events.PaintListener;
import org.eclipse.swt.graphics.Font;
import org.eclipse.swt.graphics.GC;
import org.eclipse.swt.internal.graphics.*;
import org.eclipse.swt.internal.graphics.GCOperation.DrawLine;
import org.eclipse.swt.internal.graphics.GCOperation.SetProperty;
import org.eclipse.swt.widgets.*;

public class CanvasLCA_Test extends TestCase {

  private Display display;
  private Shell shell;
  private CanvasLCA lca;

  protected void setUp() throws Exception {
    Fixture.setUp();
    display = new Display();
    shell = new Shell( display );
    lca = new CanvasLCA();
    Fixture.fakeNewRequest( display );
  }

  protected void tearDown() throws Exception {
    Fixture.tearDown();
  }

  public void testRenderCreate() throws IOException {
    Canvas canvas = new Canvas( shell, SWT.NONE );

    lca.renderInitialization( canvas );

    Message message = Fixture.getProtocolMessage();
    CreateOperation canvasCreate = message.findCreateOperation( canvas );
    assertEquals( "rwt.widgets.Canvas", canvasCreate.getType() );
    assertEquals( WidgetUtil.getId( shell ), canvasCreate.getProperty( "parent" ) );
    String canvasId = WidgetUtil.getId( canvas );
    CreateOperation gcCreate = message.findCreateOperation( canvasId + "#gc" );
    assertEquals( "rwt.GC", gcCreate.getType() );
    assertEquals( canvasId, gcCreate.getProperty( "parent" ) );
  }

  public void testRenderDestroy() throws IOException {
    Canvas canvas = new Canvas( shell, SWT.NONE );

    lca.renderDispose( canvas );

    Message message = Fixture.getProtocolMessage();
    DestroyOperation canvasDestroy = ( DestroyOperation )message.getOperation( 0 );
    DestroyOperation gcDestroy = ( DestroyOperation )message.getOperation( 1 );
    String canvasId = WidgetUtil.getId( canvas );
    assertEquals( canvasId, canvasDestroy.getTarget() );
    assertEquals( canvasId + "#gc", gcDestroy.getTarget() );
  }

  public void testWriqteSingleGCOperation() throws IOException {
    Fixture.fakeResponseWriter();
    Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    GCAdapter adapter = ( GCAdapter )canvas.getAdapter( IGCAdapter.class );
    adapter.addGCOperation( new DrawLine( 1, 2, 3, 4 ) );
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 50, 50, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );"
      + "gc.drawLine( 1, 2, 3, 4 );";
    assertEquals( expected, Fixture.getAllMarkup() );
  }

  public void testWriteMultipleGCOperations() throws IOException {
    Fixture.fakeResponseWriter();
    Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    GCAdapter adapter = ( GCAdapter )canvas.getAdapter( IGCAdapter.class );
    adapter.addGCOperation( new DrawLine( 1, 2, 3, 4 ) );
    adapter.addGCOperation( new DrawLine( 5, 6, 7, 8 ) );
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 50, 50, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );"
      + "gc.drawLine( 1, 2, 3, 4 );"
      + "gc.drawLine( 5, 6, 7, 8 );";
    assertEquals( expected, Fixture.getAllMarkup() );
  }

  // see bug 323080
  public void testMultipleGC_SetFont() throws IOException {
    Fixture.fakeResponseWriter();
    Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    GC gc = new GC( canvas );
    gc.setFont( new Font( display, "Tahoma", 16, SWT.BOLD ) );
    gc.dispose();
    gc = new GC( canvas );
    gc.setFont( new Font( display, "Tahoma", 16, SWT.BOLD ) );
    gc.dispose();
    gc = new GC( canvas );
    gc.setFont( new Font( display, "Tahoma", 16, SWT.BOLD ) );
    gc.dispose();
    new CanvasLCA().renderChanges( canvas );
    assertEquals( "", Fixture.getAllMarkup() );
  }

  public void testTrimTrailingSetOperations() throws IOException {
    Fixture.fakeResponseWriter();
     Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    GCAdapter adapter = ( GCAdapter )canvas.getAdapter( IGCAdapter.class );
    adapter.addGCOperation( new DrawLine( 1, 2, 3, 4 ) );
    adapter.addGCOperation( new DrawLine( 5, 6, 7, 8 ) );
    Font font = new Font( display, "Arial", 15, SWT.NORMAL );
    adapter.addGCOperation( new SetProperty( font.getFontData()[ 0 ] ) );
    SetProperty operation = new SetProperty( SetProperty.LINE_WIDTH, 5 );
    adapter.addGCOperation( operation );
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 50, 50, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );"
      + "gc.drawLine( 1, 2, 3, 4 );"
      + "gc.drawLine( 5, 6, 7, 8 );";
    assertEquals( expected, Fixture.getAllMarkup() );
    assertEquals( 0, adapter.getGCOperations().length );
  }

  public void testNoDrawOperations() throws IOException {
    Fixture.fakeResponseWriter();
     Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    GCAdapter adapter = ( GCAdapter )canvas.getAdapter( IGCAdapter.class );
    Font font = new Font( display, "Arial", 15, SWT.NORMAL );
    adapter.addGCOperation( new SetProperty( font.getFontData()[ 0 ] ) );
    SetProperty operation = new SetProperty( SetProperty.LINE_WIDTH, 5 );
    adapter.addGCOperation( operation );
    new CanvasLCA().renderChanges( canvas );
    assertEquals( "", Fixture.getAllMarkup() );
    assertEquals( 0, adapter.getGCOperations().length );
  }

  public void testRenderOperations_Resize() throws IOException {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    canvas.addPaintListener( new PaintListener() {
      public void paintControl( final PaintEvent event ) {
        event.gc.drawLine( 1, 2, 3, 4 );
        event.gc.drawLine( 5, 6, 7, 8 );
      }
    } );
    Fixture.fakeResponseWriter();
    new CanvasLCA().renderChanges( canvas );
    assertEquals( "", Fixture.getAllMarkup() );
    canvas.setSize( 150, 150 );
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 150, 150, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );"
      + "gc.drawLine( 1, 2, 3, 4 );"
      + "gc.drawLine( 5, 6, 7, 8 );";
    assertTrue( Fixture.getAllMarkup().indexOf( expected ) != -1 );
  }

  public void testRenderOperations_Redraw() throws IOException {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
     Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    canvas.addPaintListener( new PaintListener() {
      public void paintControl( final PaintEvent event ) {
        event.gc.drawLine( 1, 2, 3, 4 );
        event.gc.drawLine( 5, 6, 7, 8 );
      }
    } );
    Fixture.fakeResponseWriter();
    new CanvasLCA().renderChanges( canvas );
    assertEquals( "", Fixture.getAllMarkup() );
    canvas.redraw();
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 50, 50, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );"
      + "gc.drawLine( 1, 2, 3, 4 );"
      + "gc.drawLine( 5, 6, 7, 8 );";
    assertTrue( Fixture.getAllMarkup().indexOf( expected ) != -1 );
  }

  public void testClearDrawing() throws IOException {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
      Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    canvas.getAdapter( IGCAdapter.class );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    canvas.addPaintListener( new PaintListener() {
      public void paintControl( final PaintEvent event ) {
      }
    } );
    Fixture.fakeResponseWriter();
    canvas.redraw();
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 50, 50, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );";
    assertTrue( Fixture.getAllMarkup().indexOf( expected ) != -1 );
  }

  public void testRenderOperations_DisposedFont() throws IOException {
    Fixture.fakePhase( PhaseId.PROCESS_ACTION );
    Canvas canvas = new Canvas( shell, SWT.NONE );
    canvas.setSize( 50, 50 );
    canvas.setFont( new Font( display, "Arial", 11, SWT.NORMAL ) );
    Fixture.markInitialized( display );
    Fixture.markInitialized( canvas );
    Fixture.preserveWidgets();
    canvas.addPaintListener( new PaintListener() {
      public void paintControl( final PaintEvent event ) {
        Font font = new Font( display, "Verdana", 18, SWT.BOLD );
        event.gc.setFont( font );
        event.gc.drawLine( 1, 2, 3, 4 );
        font.dispose();
      }
    } );
    Fixture.fakeResponseWriter();
    canvas.redraw();
    new CanvasLCA().renderChanges( canvas );
    String expected
      = "var gc = org.eclipse.rwt.protocol.ObjectManager.getObject( \"w2#gc\" );"
      + "gc.init( 50, 50, \"11px Arial\", \"#ffffff\", \"#4a4a4a\" );"
      + "gc.setProperty( \"font\", \"bold 18px Verdana\" );"
      + "gc.drawLine( 1, 2, 3, 4 );";
    assertTrue( Fixture.getAllMarkup().indexOf( expected ) != -1 );
  }
}
